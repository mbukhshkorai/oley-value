import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsObject,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';

export class SubmitWidgetValuationDto {
  @ApiProperty({ example: '123 Main St, San Francisco, CA 94105' })
  @IsString()
  address: string;

  @ApiProperty({ type: 'object', required: false })
  @IsOptional()
  @IsObject()
  fullAddress?: any;

  @ApiProperty({ enum: PropertyType, required: false })
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

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+15551234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  emailOptIn?: boolean;
}
