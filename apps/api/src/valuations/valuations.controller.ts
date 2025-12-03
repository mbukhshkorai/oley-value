import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request, Res, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ValuationsService } from './valuations.service';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Valuations')
@Controller('valuations')
export class ValuationsController {
  constructor(private readonly valuationsService: ValuationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new valuation' })
  @ApiResponse({ status: 201, description: 'Valuation created successfully' })
  @ApiResponse({ status: 403, description: 'No credits available' })
  async create(@Request() req, @Body() createValuationDto: CreateValuationDto) {
    return this.valuationsService.create(req.user.userId, createValuationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all valuations for current user' })
  @ApiResponse({ status: 200, description: 'Returns all valuations' })
  async findAll(@Request() req, @Query() filters: any) {
    return this.valuationsService.findAll(req.user.userId, filters);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Returns dashboard stats' })
  async getStats(@Request() req) {
    return this.valuationsService.getDashboardStats(req.user.userId);
  }

  @Get('share/:shareUrl')
  @ApiOperation({ summary: 'Get valuation by public share URL' })
  @ApiResponse({ status: 200, description: 'Returns valuation' })
  @ApiResponse({ status: 404, description: 'Valuation not found' })
  async findByShareUrl(@Param('shareUrl') shareUrl: string) {
    return this.valuationsService.findByShareUrl(shareUrl);
  }

  @Get(':id/pdf')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate and download PDF for valuation' })
  @ApiResponse({ status: 200, description: 'Returns PDF file' })
  @ApiResponse({ status: 404, description: 'Valuation not found' })
  @Header('Content-Type', 'application/pdf')
  async generatePdf(
    @Param('id') id: string,
    @Request() req,
    @Query('customMessage') customMessage: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.valuationsService.generatePdf(id, req.user.userId, customMessage);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=valuation-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get valuation by ID' })
  @ApiResponse({ status: 200, description: 'Returns valuation' })
  @ApiResponse({ status: 404, description: 'Valuation not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.valuationsService.findOne(id, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete valuation' })
  @ApiResponse({ status: 200, description: 'Valuation deleted' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.valuationsService.remove(id, req.user.userId);
  }
}
