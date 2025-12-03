import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

export interface PropertyData {
  address: string;
  propertyType?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  estimatedValue: number;
  valueLow: number;
  valueHigh: number;
  confidenceScore?: number;
  comparables?: any[];
  rentcastData?: any;
  purpose?: string;
}

export interface RealtorBranding {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  licenseNumber?: string;
  websiteUrl?: string;
  headshotUrl?: string;
}

export interface PdfGenerationOptions {
  property: PropertyData;
  realtor: RealtorBranding;
  includeMap?: boolean;
  includeCharts?: boolean;
  customMessage?: string;
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  private browser: puppeteer.Browser | null = null;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Initialize Puppeteer browser instance
   */
  private async getBrowser(): Promise<puppeteer.Browser> {
    if (!this.browser || !this.browser.connected) {
      this.logger.log('Launching Puppeteer browser...');
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });
    }
    return this.browser;
  }

  /**
   * Close browser instance
   */
  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.logger.log('Puppeteer browser closed');
    }
  }

  /**
   * Generate HTML template for PDF
   */
  private generateHtmlTemplate(options: PdfGenerationOptions): string {
    const { property, realtor, customMessage } = options;

    // Format currency
    const formatCurrency = (value: number) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);

    // Format number
    const formatNumber = (value: number) =>
      new Intl.NumberFormat('en-US').format(value);

    // Get comparable properties (limited to 5)
    const comparables = property.comparables?.slice(0, 5) || [];

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Property Valuation Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      color: #1f2937;
      line-height: 1.6;
      font-size: 14px;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      background: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #3B82F6;
    }

    .header-left h1 {
      font-size: 28px;
      color: #3B82F6;
      margin-bottom: 5px;
    }

    .header-left p {
      color: #6b7280;
      font-size: 12px;
    }

    .header-right {
      text-align: right;
    }

    .realtor-info {
      margin-bottom: 10px;
    }

    .realtor-info h3 {
      font-size: 16px;
      color: #1f2937;
      margin-bottom: 5px;
    }

    .realtor-info p {
      font-size: 12px;
      color: #6b7280;
      margin: 2px 0;
    }

    .property-header {
      background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
      color: white;
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 30px;
    }

    .property-header h2 {
      font-size: 24px;
      margin-bottom: 10px;
    }

    .property-details {
      display: flex;
      gap: 20px;
      margin-top: 15px;
    }

    .property-detail-item {
      flex: 1;
    }

    .property-detail-item label {
      display: block;
      font-size: 11px;
      opacity: 0.9;
      margin-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .property-detail-item value {
      display: block;
      font-size: 18px;
      font-weight: bold;
    }

    .valuation-section {
      background: #f9fafb;
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 30px;
    }

    .valuation-section h3 {
      font-size: 18px;
      color: #1f2937;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }

    .estimated-value {
      text-align: center;
      padding: 20px;
      background: white;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .estimated-value label {
      display: block;
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    .estimated-value .value {
      font-size: 42px;
      font-weight: bold;
      color: #3B82F6;
    }

    .value-range {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
    }

    .value-range-item {
      text-align: center;
    }

    .value-range-item label {
      display: block;
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 5px;
      text-transform: uppercase;
    }

    .value-range-item .value {
      font-size: 22px;
      font-weight: bold;
      color: #1f2937;
    }

    .comparables-section {
      margin-bottom: 30px;
    }

    .comparables-section h3 {
      font-size: 18px;
      color: #1f2937;
      margin-bottom: 15px;
    }

    .comparables-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .comparables-table thead {
      background: #f3f4f6;
    }

    .comparables-table th {
      padding: 12px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      font-weight: 600;
    }

    .comparables-table td {
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
    }

    .disclaimer {
      margin-top: 40px;
      padding: 20px;
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      border-radius: 5px;
    }

    .disclaimer h4 {
      font-size: 14px;
      color: #92400e;
      margin-bottom: 10px;
    }

    .disclaimer p {
      font-size: 11px;
      color: #78350f;
      line-height: 1.5;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 11px;
    }

    .custom-message {
      background: #eff6ff;
      border-left: 4px solid #3B82F6;
      padding: 15px;
      margin-bottom: 25px;
      border-radius: 5px;
    }

    .custom-message p {
      font-size: 13px;
      color: #1e40af;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h1>Property Valuation Report</h1>
        <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div class="header-right">
        <div class="realtor-info">
          <h3>${realtor.firstName} ${realtor.lastName}</h3>
          ${realtor.company ? `<p><strong>${realtor.company}</strong></p>` : ''}
          <p>${realtor.email}</p>
          ${realtor.phone ? `<p>${realtor.phone}</p>` : ''}
          ${realtor.licenseNumber ? `<p>License: ${realtor.licenseNumber}</p>` : ''}
          ${realtor.websiteUrl ? `<p>${realtor.websiteUrl}</p>` : ''}
        </div>
      </div>
    </div>

    <!-- Custom Message -->
    ${customMessage ? `
      <div class="custom-message">
        <p>${customMessage}</p>
      </div>
    ` : ''}

    <!-- Property Header -->
    <div class="property-header">
      <h2>${property.address}</h2>
      ${property.purpose ? `<p style="opacity: 0.9; margin-top: 5px;">Purpose: ${property.purpose}</p>` : ''}
      <div class="property-details">
        ${property.propertyType ? `
          <div class="property-detail-item">
            <label>Property Type</label>
            <value>${property.propertyType.replace('_', ' ')}</value>
          </div>
        ` : ''}
        ${property.beds ? `
          <div class="property-detail-item">
            <label>Bedrooms</label>
            <value>${property.beds}</value>
          </div>
        ` : ''}
        ${property.baths ? `
          <div class="property-detail-item">
            <label>Bathrooms</label>
            <value>${property.baths}</value>
          </div>
        ` : ''}
        ${property.sqft ? `
          <div class="property-detail-item">
            <label>Square Feet</label>
            <value>${formatNumber(property.sqft)}</value>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Valuation Section -->
    <div class="valuation-section">
      <h3>Estimated Market Value</h3>
      <div class="estimated-value">
        <label>Current Estimate</label>
        <div class="value">${formatCurrency(property.estimatedValue)}</div>
        ${property.confidenceScore ? `<p style="margin-top: 10px; color: #6b7280; font-size: 12px;">Confidence Score: ${property.confidenceScore}%</p>` : ''}
      </div>
      <div class="value-range">
        <div class="value-range-item">
          <label>Low Estimate</label>
          <div class="value">${formatCurrency(property.valueLow)}</div>
        </div>
        <div class="value-range-item">
          <label>High Estimate</label>
          <div class="value">${formatCurrency(property.valueHigh)}</div>
        </div>
      </div>
    </div>

    <!-- Comparable Properties -->
    ${comparables.length > 0 ? `
      <div class="comparables-section">
        <h3>Comparable Properties</h3>
        <table class="comparables-table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Beds</th>
              <th>Baths</th>
              <th>Sq Ft</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${comparables.map((comp: any) => `
              <tr>
                <td>${comp.address || 'N/A'}</td>
                <td>${comp.bedrooms || '-'}</td>
                <td>${comp.bathrooms || '-'}</td>
                <td>${comp.squareFootage ? formatNumber(comp.squareFootage) : '-'}</td>
                <td>${comp.price ? formatCurrency(comp.price) : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    <!-- Disclaimer -->
    <div class="disclaimer">
      <h4>Important Disclaimer</h4>
      <p>
        This valuation is an estimate based on available data and comparable properties in the area.
        It should not be considered an official appraisal. Actual market value may vary based on
        property condition, location specifics, market conditions, and other factors. For a formal
        appraisal, please consult a licensed appraiser.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>This report was prepared exclusively for the recipient. Unauthorized distribution is prohibited.</p>
      <p style="margin-top: 5px;">&copy; ${new Date().getFullYear()} ${realtor.company || `${realtor.firstName} ${realtor.lastName}`}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate PDF from valuation data
   */
  async generateValuationPdf(
    valuationId: string,
    options?: { customMessage?: string },
  ): Promise<Buffer> {
    const valuation = await this.prisma.valuation.findUnique({
      where: { id: valuationId },
      include: {
        user: true,
        lead: true,
      },
    });

    if (!valuation) {
      throw new Error('Valuation not found');
    }

    // Prepare property data
    const propertyData: PropertyData = {
      address: valuation.address,
      propertyType: valuation.propertyType || undefined,
      beds: valuation.beds || undefined,
      baths: valuation.baths || undefined,
      sqft: valuation.sqft || undefined,
      estimatedValue: valuation.estimatedValue,
      valueLow: valuation.valueLow,
      valueHigh: valuation.valueHigh,
      confidenceScore: valuation.confidenceScore || undefined,
      comparables: valuation.comparables as any[] || [],
      purpose: valuation.purpose || undefined,
    };

    // Prepare realtor branding
    const realtorBranding: RealtorBranding = {
      firstName: valuation.user.firstName,
      lastName: valuation.user.lastName,
      email: valuation.user.email,
      phone: valuation.user.phone || undefined,
      company: valuation.user.company || undefined,
      licenseNumber: valuation.user.licenseNumber || undefined,
      websiteUrl: valuation.user.websiteUrl || undefined,
      headshotUrl: valuation.user.headshotUrl || undefined,
    };

    return this.generatePdf({
      property: propertyData,
      realtor: realtorBranding,
      customMessage: options?.customMessage,
      includeMap: true,
      includeCharts: true,
    });
  }

  /**
   * Generate PDF from options
   */
  async generatePdf(options: PdfGenerationOptions): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      const html = this.generateHtmlTemplate(options);

      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm',
        },
      });

      this.logger.log('PDF generated successfully');

      return Buffer.from(pdfBuffer);
    } catch (error) {
      this.logger.error('Failed to generate PDF', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  /**
   * Save PDF to file system (temporary storage)
   */
  async savePdfToFile(
    pdfBuffer: Buffer,
    filename: string,
  ): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'pdfs');

    // Ensure uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, pdfBuffer);

    this.logger.log(`PDF saved to ${filePath}`);
    return filePath;
  }

  /**
   * Cleanup: Close browser on module destroy
   */
  async onModuleDestroy() {
    await this.closeBrowser();
  }
}
