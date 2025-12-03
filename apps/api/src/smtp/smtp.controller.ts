import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SmtpService } from './smtp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSmtpConfigDto } from './dto/create-smtp-config.dto';
import { UpdateSmtpConfigDto } from './dto/update-smtp-config.dto';
import { SendValuationEmailDto } from './dto/send-valuation-email.dto';

@ApiTags('SMTP Configuration')
@Controller('smtp')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SmtpController {
  constructor(private readonly smtpService: SmtpService) {}

  @Get('config')
  @ApiOperation({ summary: 'Get SMTP configuration' })
  @ApiResponse({ status: 200, description: 'Returns SMTP configuration' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async getConfig(@Request() req) {
    return this.smtpService.getConfig(req.user.userId);
  }

  @Post('config')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create or update SMTP configuration' })
  @ApiResponse({ status: 200, description: 'Configuration saved' })
  async upsertConfig(@Request() req, @Body() dto: CreateSmtpConfigDto) {
    return this.smtpService.upsertConfig(req.user.userId, dto);
  }

  @Put('config')
  @ApiOperation({ summary: 'Update SMTP configuration' })
  @ApiResponse({ status: 200, description: 'Configuration updated' })
  async updateConfig(@Request() req, @Body() dto: UpdateSmtpConfigDto) {
    return this.smtpService.updateConfig(req.user.userId, dto);
  }

  @Delete('config')
  @ApiOperation({ summary: 'Delete SMTP configuration' })
  @ApiResponse({ status: 200, description: 'Configuration deleted' })
  async deleteConfig(@Request() req) {
    return this.smtpService.deleteConfig(req.user.userId);
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test SMTP connection' })
  @ApiResponse({ status: 200, description: 'Connection test result' })
  async testConnection(@Request() req) {
    return this.smtpService.testConnection(req.user.userId);
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send valuation email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Failed to send email' })
  async sendEmail(@Request() req, @Body() dto: SendValuationEmailDto) {
    return this.smtpService.sendValuationEmail(req.user.userId, dto);
  }
}
