import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from '../pdf/pdf.service';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface SendValuationEmailOptions {
  valuationId: string;
  recipientEmail: string;
  recipientName?: string;
  customMessage?: string;
  includePdf?: boolean;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private defaultTransporter: Transporter;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private pdfService: PdfService,
  ) {
    // Initialize default SMTP transporter
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      this.defaultTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.logger.log('Default SMTP transporter initialized');
    } else {
      this.logger.warn('Default SMTP credentials not configured');
    }
  }

  /**
   * Create transporter from user's SMTP configuration
   */
  private async getUserTransporter(userId: string): Promise<Transporter | null> {
    const smtpConfig = await this.prisma.smtpConfig.findUnique({
      where: { userId },
    });

    if (!smtpConfig || !smtpConfig.isConfigured) {
      return null;
    }

    const config: any = {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
    };

    // Add authentication if provided
    if (smtpConfig.username && smtpConfig.password) {
      config.auth = {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      };
    }

    // OAuth2 support for Gmail/Outlook
    if (smtpConfig.oauth2Enabled && smtpConfig.oauth2AccessToken) {
      config.auth = {
        type: 'OAuth2',
        user: smtpConfig.fromEmail,
        accessToken: smtpConfig.oauth2AccessToken,
        refreshToken: smtpConfig.oauth2RefreshToken,
        clientId: smtpConfig.oauth2ClientId,
        clientSecret: smtpConfig.oauth2ClientSecret,
      };
    }

    return nodemailer.createTransporter(config);
  }

  /**
   * Send valuation report via email
   */
  async sendValuationReport(
    userId: string,
    options: SendValuationEmailOptions,
  ): Promise<void> {
    // Get valuation data
    const valuation = await this.prisma.valuation.findUnique({
      where: { id: options.valuationId },
      include: {
        user: true,
        lead: true,
      },
    });

    if (!valuation) {
      throw new BadRequestException('Valuation not found');
    }

    if (valuation.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    // Get user's SMTP transporter or use default
    const transporter =
      (await this.getUserTransporter(userId)) || this.defaultTransporter;

    if (!transporter) {
      throw new BadRequestException(
        'No email configuration found. Please configure SMTP settings.',
      );
    }

    // Get user's SMTP config for sender info
    const smtpConfig = await this.prisma.smtpConfig.findUnique({
      where: { userId },
    });

    const fromEmail =
      smtpConfig?.fromEmail || this.configService.get<string>('SMTP_FROM');
    const fromName =
      smtpConfig?.fromName ||
      `${valuation.user.firstName} ${valuation.user.lastName}`;

    // Generate email HTML
    const emailHtml = this.generateValuationEmailTemplate({
      valuation,
      realtor: valuation.user,
      recipientName: options.recipientName || options.recipientEmail,
      customMessage: options.customMessage,
    });

    // Prepare email options
    const mailOptions: any = {
      from: `${fromName} <${fromEmail}>`,
      to: options.recipientEmail,
      subject: `Your Property Valuation for ${valuation.address}`,
      html: emailHtml,
    };

    // Attach PDF if requested
    if (options.includePdf !== false) {
      try {
        const pdfBuffer = await this.pdfService.generateValuationPdf(
          options.valuationId,
          { customMessage: options.customMessage },
        );

        mailOptions.attachments = [
          {
            filename: `valuation-${valuation.address.replace(/[^a-z0-9]/gi, '-')}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ];
      } catch (error) {
        this.logger.error('Failed to generate PDF for email', error);
        // Continue sending email without PDF
      }
    }

    // Send email
    try {
      await transporter.sendMail(mailOptions);

      // Update valuation status
      await this.prisma.valuation.update({
        where: { id: options.valuationId },
        data: { status: 'SENT' },
      });

      // Log email sent
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'EMAIL_SENT',
          entityType: 'Valuation',
          entityId: options.valuationId,
          metadata: {
            recipient: options.recipientEmail,
            includedPdf: options.includePdf !== false,
          },
        },
      });

      this.logger.log(
        `Valuation report sent to ${options.recipientEmail} for valuation ${options.valuationId}`,
      );
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw new BadRequestException(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Generate HTML email template for valuation report
   */
  private generateValuationEmailTemplate(data: {
    valuation: any;
    realtor: any;
    recipientName: string;
    customMessage?: string;
  }): string {
    const { valuation, realtor, recipientName, customMessage } = data;

    // Format currency
    const formatCurrency = (value: number) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Property Valuation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 40px; text-align: center;">
              ${realtor.headshotUrl ? `<img src="${realtor.headshotUrl}" alt="${realtor.firstName} ${realtor.lastName}" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid white; margin-bottom: 15px;">` : ''}
              <h1 style="color: white; margin: 0; font-size: 28px;">Your Property Valuation</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 14px;">${realtor.company || `${realtor.firstName} ${realtor.lastName}`}</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 40px 20px;">
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0;">
                Hi ${recipientName},
              </p>
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 15px 0;">
                Thank you for requesting a valuation for your property at <strong>${valuation.address}</strong>. I've attached a detailed report with the estimated market value and comparable properties in your area.
              </p>
              ${customMessage ? `
                <div style="background: #eff6ff; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="color: #1e40af; font-size: 14px; margin: 0; font-style: italic;">${customMessage}</p>
                </div>
              ` : ''}
            </td>
          </tr>

          <!-- Valuation Summary -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Estimated Market Value</p>
                    <p style="color: #3B82F6; font-size: 42px; font-weight: bold; margin: 0;">${formatCurrency(valuation.estimatedValue)}</p>
                    ${valuation.confidenceScore ? `<p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">Confidence Score: ${valuation.confidenceScore}%</p>` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 30px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                          <p style="color: #6b7280; font-size: 11px; text-transform: uppercase; margin: 0 0 5px 0;">Low Estimate</p>
                          <p style="color: #1f2937; font-size: 22px; font-weight: bold; margin: 0;">${formatCurrency(valuation.valueLow)}</p>
                        </td>
                        <td width="10"></td>
                        <td width="50%" style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                          <p style="color: #6b7280; font-size: 11px; text-transform: uppercase; margin: 0 0 5px 0;">High Estimate</p>
                          <p style="color: #1f2937; font-size: 22px; font-weight: bold; margin: 0;">${formatCurrency(valuation.valueHigh)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Property Details -->
          ${valuation.beds || valuation.baths || valuation.sqft ? `
            <tr>
              <td style="padding: 0 40px 30px;">
                <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">Property Details</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    ${valuation.beds ? `<td style="padding: 10px 0;"><strong>Bedrooms:</strong> ${valuation.beds}</td>` : ''}
                    ${valuation.baths ? `<td style="padding: 10px 0;"><strong>Bathrooms:</strong> ${valuation.baths}</td>` : ''}
                  </tr>
                  <tr>
                    ${valuation.sqft ? `<td style="padding: 10px 0;" colspan="2"><strong>Square Feet:</strong> ${valuation.sqft.toLocaleString()}</td>` : ''}
                  </tr>
                </table>
              </td>
            </tr>
          ` : ''}

          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <p style="color: #1f2937; font-size: 16px; margin: 0 0 20px 0;">
                I'd love to discuss this valuation with you and answer any questions you may have.
              </p>
              <a href="mailto:${realtor.email}" style="display: inline-block; background: #3B82F6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">Contact Me</a>
            </td>
          </tr>

          <!-- Realtor Contact Info -->
          <tr>
            <td style="background: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">${realtor.firstName} ${realtor.lastName}</p>
                    ${realtor.company ? `<p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">${realtor.company}</p>` : ''}
                    ${realtor.licenseNumber ? `<p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">License: ${realtor.licenseNumber}</p>` : ''}
                    <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                      Email: <a href="mailto:${realtor.email}" style="color: #3B82F6; text-decoration: none;">${realtor.email}</a>
                    </p>
                    ${realtor.phone ? `<p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Phone: ${realtor.phone}</p>` : ''}
                    ${realtor.websiteUrl ? `<p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Website: <a href="${realtor.websiteUrl}" style="color: #3B82F6; text-decoration: none;">${realtor.websiteUrl}</a></p>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; text-align: center; background: #1f2937;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This valuation is an estimate and should not be considered an official appraisal.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                &copy; ${new Date().getFullYear()} ${realtor.company || `${realtor.firstName} ${realtor.lastName}`}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  /**
   * Test SMTP configuration
   */
  async testSmtpConnection(userId: string): Promise<boolean> {
    const transporter = await this.getUserTransporter(userId);

    if (!transporter) {
      throw new BadRequestException('No SMTP configuration found');
    }

    try {
      await transporter.verify();
      this.logger.log(`SMTP connection verified for user ${userId}`);
      return true;
    } catch (error) {
      this.logger.error(`SMTP connection failed for user ${userId}`, error);
      return false;
    }
  }
}
