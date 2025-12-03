import { IsString, IsOptional, IsNumber, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PropertyType {
  SINGLE_FAMILY = 'SINGLE_FAMILY',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  MULTI_FAMILY = 'MULTI_FAMILY',
  LAND = 'LAND',
}

export class CreateValuationDto {
  @ApiProperty({ example: '123 Main St, San Francisco, CA 94105' })
  @IsString()
  address: string;

  @ApiProperty({ type: 'object', required: false })
  @IsOptional()
  @IsObject()
  fullAddress?: any;

  @ApiProperty({ enum: PropertyType, example: PropertyType.SINGLE_FAMILY, required: false })
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  beds?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  baths?: number;

  @ApiProperty({ example: 1500, required: false })
  @IsOptional()
  @IsNumber()
  sqft?: number;

  @ApiProperty({ example: 'Seller Listing', required: false })
  @IsOptional()
  @IsString()
  purpose?: string;

  // Lead information
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  leadFirstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  leadLastName?: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsString()
  leadEmail?: string;

  @ApiProperty({ example: '+15551234567', required: false })
  @IsOptional()
  @IsString()
  leadPhone?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  emailOptIn?: boolean;
}
