import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filters?: any) {
    const leads = await this.prisma.lead.findMany({
      where: {
        userId,
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        valuation: {
          select: {
            address: true,
            estimatedValue: true,
            beds: true,
            baths: true,
            sqft: true,
            propertyType: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return leads;
  }

  async findOne(id: string, userId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        valuation: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                headshotUrl: true,
                company: true,
              },
            },
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return lead;
  }

  async update(id: string, userId: string, updateLeadDto: UpdateLeadDto) {
    // Verify ownership
    await this.findOne(id, userId);

    const lead = await this.prisma.lead.update({
      where: { id },
      data: {
        ...updateLeadDto,
        ...(updateLeadDto.status === 'CONTACTED' && {
          lastContactedAt: new Date(),
        }),
      },
      include: {
        valuation: true,
      },
    });

    return lead;
  }

  async remove(id: string, userId: string) {
    // Verify ownership
    await this.findOne(id, userId);

    await this.prisma.lead.delete({
      where: { id },
    });

    return { message: 'Lead deleted successfully' };
  }

  async getDashboardStats(userId: string) {
    // Get total leads
    const totalLeads = await this.prisma.lead.count({
      where: { userId },
    });

    // Get total pipeline value (sum of all property values)
    const leads = await this.prisma.lead.findMany({
      where: { userId },
      include: {
        valuation: {
          select: { estimatedValue: true },
        },
      },
    });

    const totalPipelineValue = leads.reduce(
      (sum, lead) => sum + Number(lead.valuation.estimatedValue),
      0,
    );

    // Get total opportunity value (sum of all commissions)
    const totalOpportunityValue = leads.reduce(
      (sum, lead) => sum + Number(lead.opportunityValue),
      0,
    );

    // Get leads needing action (NEW status)
    const actionRequired = await this.prisma.lead.count({
      where: {
        userId,
        status: 'NEW',
      },
    });

    // Get leads by status
    const leadsByStatus = await this.prisma.lead.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
    });

    return {
      totalLeads,
      totalPipelineValue,
      totalOpportunityValue,
      actionRequired,
      leadsByStatus: leadsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {}),
    };
  }

  async export(userId: string, format: 'csv' | 'json' = 'csv') {
    const leads = await this.findAll(userId);

    if (format === 'json') {
      return leads;
    }

    // Convert to CSV
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Address',
      'Property Value',
      'Commission Est.',
      'Status',
      'Created At',
    ];

    const rows = leads.map((lead) => [
      `${lead.firstName} ${lead.lastName}`,
      lead.email,
      lead.phone || '',
      lead.valuation.address,
      lead.valuation.estimatedValue.toString(),
      lead.opportunityValue.toString(),
      lead.status,
      lead.createdAt.toISOString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }
}
