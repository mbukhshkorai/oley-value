import { Controller, Get, Put, Delete, Body, Param, Query, UseGuards, Request, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Leads')
@Controller('leads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all leads for current user' })
  @ApiResponse({ status: 200, description: 'Returns all leads' })
  async findAll(@Request() req, @Query() filters: any) {
    return this.leadsService.findAll(req.user.userId, filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get lead statistics' })
  @ApiResponse({ status: 200, description: 'Returns lead stats' })
  async getStats(@Request() req) {
    return this.leadsService.getDashboardStats(req.user.userId);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export leads as CSV or JSON' })
  @ApiResponse({ status: 200, description: 'Returns leads export' })
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=leads.csv')
  async export(@Request() req, @Query('format') format?: 'csv' | 'json') {
    return this.leadsService.export(req.user.userId, format);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by ID' })
  @ApiResponse({ status: 200, description: 'Returns lead' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.leadsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lead' })
  @ApiResponse({ status: 200, description: 'Lead updated' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(id, req.user.userId, updateLeadDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead' })
  @ApiResponse({ status: 200, description: 'Lead deleted' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.leadsService.remove(id, req.user.userId);
  }
}
