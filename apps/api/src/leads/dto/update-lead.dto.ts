import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  LOST = 'LOST',
}

export class UpdateLeadDto {
  @ApiProperty({ enum: LeadStatus, required: false })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customStatus?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  statusColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  statusBgColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  opportunityValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  emailOptIn?: boolean;
}
