import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RentcastService } from '../common/rentcast/rentcast.service';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class ValuationsService {
  constructor(
    private prisma: PrismaService,
    private rentcastService: RentcastService,
  ) {}

  async create(userId: string, createValuationDto: CreateValuationDto) {
    // Check if user has credits
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new BadRequestException('No subscription found');
    }

    const totalCredits = subscription.monthlyCredits + subscription.additionalCredits;
    const availableCredits = totalCredits - subscription.usedCredits;

    if (availableCredits <= 0) {
      throw new ForbiddenException('No credits available. Please upgrade or purchase additional credits.');
    }

    // Get valuation from Rentcast
    const rentcastData = await this.rentcastService.getPropertyValuation({
      address: createValuationDto.address,
      beds: createValuationDto.beds,
      baths: createValuationDto.baths,
      sqft: createValuationDto.sqft,
    });

    // Create valuation and lead in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create valuation
      const valuation = await tx.valuation.create({
        data: {
          userId,
          address: createValuationDto.address,
          fullAddress: createValuationDto.fullAddress || { address: createValuationDto.address },
          propertyType: createValuationDto.propertyType,
          beds: createValuationDto.beds,
          baths: createValuationDto.baths,
          sqft: createValuationDto.sqft,
          estimatedValue: rentcastData.estimate,
          valueLow: rentcastData.range.low,
          valueHigh: rentcastData.range.high,
          confidenceScore: rentcastData.confidence,
          comparables: rentcastData.comparables,
          rentcastData: rentcastData,
          purpose: createValuationDto.purpose,
          publicShareUrl: this.generateShareUrl(),
          source: 'DASHBOARD',
          status: 'COMPLETED',
        },
      });

      // Create lead if lead info provided
      let lead = null;
      if (createValuationDto.leadFirstName && createValuationDto.leadEmail) {
        // Calculate opportunity value (2% of property value)
        const opportunityValue = rentcastData.estimate * 0.02;

        lead = await tx.lead.create({
          data: {
            userId,
            valuationId: valuation.id,
            firstName: createValuationDto.leadFirstName,
            lastName: createValuationDto.leadLastName || '',
            email: createValuationDto.leadEmail,
            phone: createValuationDto.leadPhone,
            emailOptIn: createValuationDto.emailOptIn || false,
            opportunityValue,
            status: 'NEW',
          },
        });
      }

      // Increment used credits
      await tx.subscription.update({
        where: { userId },
        data: {
          usedCredits: subscription.usedCredits + 1,
        },
      });

      return { valuation, lead };
    });

    return result;
  }

  async findAll(userId: string, filters?: any) {
    const valuations = await this.prisma.valuation.findMany({
      where: {
        userId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.source && { source: filters.source }),
      },
      include: {
        lead: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return valuations;
  }

  async findOne(id: string, userId: string) {
    const valuation = await this.prisma.valuation.findUnique({
      where: { id },
      include: {
        lead: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            headshotUrl: true,
            company: true,
            licenseNumber: true,
          },
        },
      },
    });

    if (!valuation) {
      throw new NotFoundException('Valuation not found');
    }

    if (valuation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return valuation;
  }

  async findByShareUrl(shareUrl: string) {
    const valuation = await this.prisma.valuation.findUnique({
      where: { publicShareUrl: shareUrl },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            headshotUrl: true,
            company: true,
            licenseNumber: true,
          },
        },
      },
    });

    if (!valuation) {
      throw new NotFoundException('Valuation not found');
    }

    // Update status to VIEWED if not already
    if (valuation.status === 'COMPLETED' || valuation.status === 'SENT') {
      await this.prisma.valuation.update({
        where: { id: valuation.id },
        data: { status: 'VIEWED' },
      });
    }

    return valuation;
  }

  async remove(id: string, userId: string) {
    const valuation = await this.findOne(id, userId);

    await this.prisma.valuation.delete({
      where: { id },
    });

    return { message: 'Valuation deleted successfully' };
  }

  async getDashboardStats(userId: string) {
    // Get total valuations
    const totalValuations = await this.prisma.valuation.count({
      where: { userId },
    });

    // Get portfolio volume (sum of all property values)
    const valuations = await this.prisma.valuation.findMany({
      where: { userId },
      select: { estimatedValue: true },
    });

    const portfolioVolume = valuations.reduce(
      (sum, v) => sum + Number(v.estimatedValue),
      0,
    );

    // Get average property value
    const avgPropertyValue = totalValuations > 0 ? portfolioVolume / totalValuations : 0;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCount = await this.prisma.valuation.count({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    return {
      totalValuations,
      portfolioVolume,
      avgPropertyValue,
      recentCount,
    };
  }

  private generateShareUrl(): string {
    return randomBytes(16).toString('hex');
  }
}
