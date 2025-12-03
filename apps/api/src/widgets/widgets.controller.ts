import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Ip,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WidgetsService } from './widgets.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { SubmitWidgetValuationDto } from './dto/submit-widget-valuation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Widgets')
@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new widget' })
  @ApiResponse({ status: 201, description: 'Widget created successfully' })
  async create(@Request() req, @Body() createWidgetDto: CreateWidgetDto) {
    return this.widgetsService.create(req.user.userId, createWidgetDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all widgets for current user' })
  @ApiResponse({ status: 200, description: 'Returns all widgets' })
  async findAll(@Request() req) {
    return this.widgetsService.findAll(req.user.userId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get widget statistics for dashboard' })
  @ApiResponse({ status: 200, description: 'Returns widget stats' })
  async getStats(@Request() req) {
    return this.widgetsService.getDashboardStats(req.user.userId);
  }

  @Get('embed/:embedCode')
  @ApiOperation({ summary: 'Get widget configuration by embed code (public)' })
  @ApiResponse({ status: 200, description: 'Returns widget configuration' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  async getByEmbedCode(@Param('embedCode') embedCode: string) {
    return this.widgetsService.findByEmbedCode(embedCode);
  }

  @Post('embed/:embedCode/submit')
  @ApiOperation({ summary: 'Submit valuation through widget (public)' })
  @ApiResponse({ status: 201, description: 'Valuation submitted successfully' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  @ApiResponse({ status: 403, description: 'No credits available' })
  async submitValuation(
    @Param('embedCode') embedCode: string,
    @Body() submitDto: SubmitWidgetValuationDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    return this.widgetsService.submitValuation(
      embedCode,
      submitDto,
      userAgent,
      ip,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get widget by ID' })
  @ApiResponse({ status: 200, description: 'Returns widget' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.widgetsService.findOne(id, req.user.userId);
  }

  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get widget analytics' })
  @ApiResponse({ status: 200, description: 'Returns widget analytics' })
  async getAnalytics(@Param('id') id: string, @Request() req) {
    return this.widgetsService.getAnalytics(id, req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update widget' })
  @ApiResponse({ status: 200, description: 'Widget updated' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateWidgetDto: UpdateWidgetDto,
  ) {
    return this.widgetsService.update(id, req.user.userId, updateWidgetDto);
  }

  @Post(':id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle widget active status' })
  @ApiResponse({ status: 200, description: 'Widget status toggled' })
  async toggleActive(@Param('id') id: string, @Request() req) {
    return this.widgetsService.toggleActive(id, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete widget' })
  @ApiResponse({ status: 200, description: 'Widget deleted' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.widgetsService.remove(id, req.user.userId);
  }
}
