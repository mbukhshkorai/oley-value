import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { EmailService } from '../common/email/email.service';
import { CreateSmtpConfigDto } from './dto/create-smtp-config.dto';
import { UpdateSmtpConfigDto } from './dto/update-smtp-config.dto';
import { SendValuationEmailDto } from './dto/send-valuation-email.dto';

@Injectable()
export class SmtpService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * Get SMTP configuration for a user
   */
  async getConfig(userId: string) {
    const config = await this.prisma.smtpConfig.findUnique({
      where: { userId },
    });

    if (!config) {
      throw new NotFoundException('SMTP configuration not found');
    }

    // Don't return sensitive data
    const { password, oauth2AccessToken, oauth2RefreshToken, ...safeConfig } =
      config as any;

    return safeConfig;
  }

  /**
   * Create or update SMTP configuration
   */
  async upsertConfig(userId: string, dto: CreateSmtpConfigDto) {
    const existing = await this.prisma.smtpConfig.findUnique({
      where: { userId },
    });

    const data = {
      host: dto.host,
      port: dto.port,
      secure: dto.secure ?? true,
      username: dto.username,
      password: dto.password,
      fromEmail: dto.fromEmail,
      fromName: dto.fromName,
      oauth2Enabled: dto.oauth2Enabled ?? false,
      oauth2ClientId: dto.oauth2ClientId,
      oauth2ClientSecret: dto.oauth2ClientSecret,
      oauth2AccessToken: dto.oauth2AccessToken,
      oauth2RefreshToken: dto.oauth2RefreshToken,
      isConfigured: true,
    };

    if (existing) {
      return this.prisma.smtpConfig.update({
        where: { userId },
        data,
      });
    } else {
      return this.prisma.smtpConfig.create({
        data: {
          userId,
          ...data,
        },
      });
    }
  }

  /**
   * Update SMTP configuration
   */
  async updateConfig(userId: string, dto: UpdateSmtpConfigDto) {
    const config = await this.prisma.smtpConfig.findUnique({
      where: { userId },
    });

    if (!config) {
      throw new NotFoundException('SMTP configuration not found');
    }

    return this.prisma.smtpConfig.update({
      where: { userId },
      data: dto,
    });
  }

  /**
   * Delete SMTP configuration
   */
  async deleteConfig(userId: string) {
    const config = await this.prisma.smtpConfig.findUnique({
      where: { userId },
    });

    if (!config) {
      throw new NotFoundException('SMTP configuration not found');
    }

    await this.prisma.smtpConfig.delete({
      where: { userId },
    });

    return { message: 'SMTP configuration deleted successfully' };
  }

  /**
   * Test SMTP connection
   */
  async testConnection(userId: string) {
    try {
      const result = await this.emailService.testSmtpConnection(userId);
      return {
        success: result,
        message: result
          ? 'SMTP connection successful'
          : 'SMTP connection failed',
      };
    } catch (error) {
      throw new BadRequestException(`SMTP test failed: ${error.message}`);
    }
  }

  /**
   * Send valuation email
   */
  async sendValuationEmail(userId: string, dto: SendValuationEmailDto) {
    try {
      await this.emailService.sendValuationReport(userId, {
        valuationId: dto.valuationId,
        recipientEmail: dto.recipientEmail,
        recipientName: dto.recipientName,
        customMessage: dto.customMessage,
        includePdf: dto.includePdf,
      });

      return {
        success: true,
        message: 'Valuation email sent successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to send email: ${error.message}`);
    }
  }
}
