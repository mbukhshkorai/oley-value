import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RentcastService } from '../common/rentcast/rentcast.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { SubmitWidgetValuationDto } from './dto/submit-widget-valuation.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class WidgetsService {
  constructor(
    private prisma: PrismaService,
    private rentcastService: RentcastService,
  ) {}

  /**
   * Create a new widget
   */
  async create(userId: string, createWidgetDto: CreateWidgetDto) {
    const embedCode = this.generateEmbedCode();

    const widget = await this.prisma.widget.create({
      data: {
        userId,
        name: createWidgetDto.name,
        primaryColor: createWidgetDto.primaryColor || '#3B82F6',
        secondaryColor: createWidgetDto.secondaryColor || '#2563EB',
        textColor: createWidgetDto.textColor || '#1F2937',
        backgroundColor: createWidgetDto.backgroundColor || '#FFFFFF',
        fontFamily: createWidgetDto.fontFamily || 'Arial, sans-serif',
        logoUrl: createWidgetDto.logoUrl,
        customMessage: createWidgetDto.customMessage,
        successMessage:
          createWidgetDto.successMessage ||
          'Thank you! Your property valuation has been sent to your email.',
        redirectUrl: createWidgetDto.redirectUrl,
        embedCode,
        impressions: 0,
        submissions: 0,
        conversionRate: 0,
        isActive: true,
      },
    });

    return widget;
  }

  /**
   * Get all widgets for a user
   */
  async findAll(userId: string) {
    const widgets = await this.prisma.widget.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return widgets;
  }

  /**
   * Get a single widget by ID
   */
  async findOne(id: string, userId: string) {
    const widget = await this.prisma.widget.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            company: true,
            licenseNumber: true,
            headshotUrl: true,
            websiteUrl: true,
          },
        },
      },
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

    if (widget.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return widget;
  }

  /**
   * Get widget by embed code (public access)
   */
  async findByEmbedCode(embedCode: string) {
    const widget = await this.prisma.widget.findUnique({
      where: { embedCode },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            company: true,
            licenseNumber: true,
            headshotUrl: true,
            websiteUrl: true,
          },
        },
      },
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

    if (!widget.isActive) {
      throw new BadRequestException('Widget is not active');
    }

    // Increment impressions
    await this.prisma.widget.update({
      where: { id: widget.id },
      data: {
        impressions: widget.impressions + 1,
      },
    });

    // Track analytics event
    await this.prisma.analyticsEvent.create({
      data: {
        userId: widget.userId,
        widgetId: widget.id,
        eventType: 'WIDGET_VIEW',
        metadata: {
          embedCode,
          userAgent: 'Unknown', // Will be set from request headers
        },
      },
    });

    return widget;
  }

  /**
   * Update a widget
   */
  async update(id: string, userId: string, updateWidgetDto: UpdateWidgetDto) {
    await this.findOne(id, userId);

    const widget = await this.prisma.widget.update({
      where: { id },
      data: updateWidgetDto,
    });

    return widget;
  }

  /**
   * Delete a widget
   */
  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.widget.delete({
      where: { id },
    });

    return { message: 'Widget deleted successfully' };
  }

  /**
   * Toggle widget active status
   */
  async toggleActive(id: string, userId: string) {
    const widget = await this.findOne(id, userId);

    const updated = await this.prisma.widget.update({
      where: { id },
      data: {
        isActive: !widget.isActive,
      },
    });

    return updated;
  }

  /**
   * Submit a valuation through a widget (public endpoint)
   */
  async submitValuation(
    embedCode: string,
    submitDto: SubmitWidgetValuationDto,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const widget = await this.prisma.widget.findUnique({
      where: { embedCode },
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

    if (!widget.isActive) {
      throw new BadRequestException('Widget is not active');
    }

    // Check if user has credits
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId: widget.userId },
    });

    if (!subscription) {
      throw new BadRequestException('Widget owner has no subscription');
    }

    const totalCredits =
      subscription.monthlyCredits + subscription.additionalCredits;
    const availableCredits = totalCredits - subscription.usedCredits;

    if (availableCredits <= 0) {
      throw new ForbiddenException(
        'Widget owner has no credits available. Please contact the realtor.',
      );
    }

    // Get valuation from Rentcast
    const rentcastData = await this.rentcastService.getPropertyValuation({
      address: submitDto.address,
      beds: submitDto.beds,
      baths: submitDto.baths,
      sqft: submitDto.sqft,
    });

    // Create valuation and lead in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create valuation
      const valuation = await tx.valuation.create({
        data: {
          userId: widget.userId,
          address: submitDto.address,
          fullAddress: submitDto.fullAddress || { address: submitDto.address },
          propertyType: submitDto.propertyType,
          beds: submitDto.beds,
          baths: submitDto.baths,
          sqft: submitDto.sqft,
          estimatedValue: rentcastData.estimate,
          valueLow: rentcastData.range.low,
          valueHigh: rentcastData.range.high,
          confidenceScore: rentcastData.confidence,
          comparables: rentcastData.comparables,
          rentcastData: rentcastData,
          publicShareUrl: this.generateShareUrl(),
          source: 'WIDGET',
          status: 'COMPLETED',
        },
      });

      // Create lead
      const opportunityValue = rentcastData.estimate * 0.02; // 2% commission

      const lead = await tx.lead.create({
        data: {
          userId: widget.userId,
          valuationId: valuation.id,
          firstName: submitDto.firstName,
          lastName: submitDto.lastName,
          email: submitDto.email,
          phone: submitDto.phone,
          emailOptIn: submitDto.emailOptIn || false,
          opportunityValue,
          status: 'NEW',
        },
      });

      // Increment widget submissions
      await tx.widget.update({
        where: { id: widget.id },
        data: {
          submissions: widget.submissions + 1,
          conversionRate:
            ((widget.submissions + 1) / (widget.impressions + 1)) * 100,
        },
      });

      // Increment used credits
      await tx.subscription.update({
        where: { userId: widget.userId },
        data: {
          usedCredits: subscription.usedCredits + 1,
        },
      });

      // Track analytics event
      await tx.analyticsEvent.create({
        data: {
          userId: widget.userId,
          widgetId: widget.id,
          valuationId: valuation.id,
          leadId: lead.id,
          eventType: 'WIDGET_SUBMISSION',
          metadata: {
            embedCode,
            userAgent: userAgent || 'Unknown',
            ipAddress: ipAddress || 'Unknown',
            propertyAddress: submitDto.address,
          },
        },
      });

      return { valuation, lead };
    });

    return {
      success: true,
      message: widget.successMessage,
      redirectUrl: widget.redirectUrl,
      valuation: {
        address: result.valuation.address,
        estimatedValue: result.valuation.estimatedValue,
        valueLow: result.valuation.valueLow,
        valueHigh: result.valuation.valueHigh,
        shareUrl: result.valuation.publicShareUrl,
      },
    };
  }

  /**
   * Get widget analytics
   */
  async getAnalytics(id: string, userId: string) {
    const widget = await this.findOne(id, userId);

    // Get submissions over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const events = await this.prisma.analyticsEvent.findMany({
      where: {
        widgetId: id,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: 'desc' },
    });

    const viewEvents = events.filter((e) => e.eventType === 'WIDGET_VIEW');
    const submissionEvents = events.filter(
      (e) => e.eventType === 'WIDGET_SUBMISSION',
    );

    // Group by date
    const dailyStats = this.groupEventsByDate(events);

    return {
      totalImpressions: widget.impressions,
      totalSubmissions: widget.submissions,
      conversionRate: widget.conversionRate,
      viewsLast30Days: viewEvents.length,
      submissionsLast30Days: submissionEvents.length,
      dailyStats,
    };
  }

  /**
   * Get widget stats for dashboard
   */
  async getDashboardStats(userId: string) {
    const widgets = await this.prisma.widget.findMany({
      where: { userId },
    });

    const totalImpressions = widgets.reduce((sum, w) => sum + w.impressions, 0);
    const totalSubmissions = widgets.reduce((sum, w) => sum + w.submissions, 0);
    const avgConversionRate =
      widgets.length > 0
        ? widgets.reduce((sum, w) => sum + w.conversionRate, 0) / widgets.length
        : 0;

    const activeWidgets = widgets.filter((w) => w.isActive).length;

    return {
      totalWidgets: widgets.length,
      activeWidgets,
      totalImpressions,
      totalSubmissions,
      avgConversionRate: Math.round(avgConversionRate * 100) / 100,
    };
  }

  /**
   * Generate embed code
   */
  private generateEmbedCode(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Generate share URL
   */
  private generateShareUrl(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Group events by date
   */
  private groupEventsByDate(events: any[]) {
    const grouped: Record<string, { views: number; submissions: number }> = {};

    events.forEach((event) => {
      const date = event.createdAt.toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { views: 0, submissions: 0 };
      }

      if (event.eventType === 'WIDGET_VIEW') {
        grouped[date].views++;
      } else if (event.eventType === 'WIDGET_SUBMISSION') {
        grouped[date].submissions++;
      }
    });

    return Object.entries(grouped).map(([date, stats]) => ({
      date,
      ...stats,
    }));
  }
}
