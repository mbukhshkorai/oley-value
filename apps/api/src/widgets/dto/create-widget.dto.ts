import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWidgetDto {
  @ApiProperty({ example: 'My Property Valuation Widget' })
  @IsString()
  name: string;

  @ApiProperty({ example: '#3B82F6', required: false })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiProperty({ example: '#2563EB', required: false })
  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @ApiProperty({ example: '#1F2937', required: false })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiProperty({ example: '#FFFFFF', required: false })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ example: 'Arial, sans-serif', required: false })
  @IsOptional()
  @IsString()
  fontFamily?: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiProperty({
    example: 'Get an instant home valuation for free!',
    required: false,
  })
  @IsOptional()
  @IsString()
  customMessage?: string;

  @ApiProperty({
    example: 'Thank you! Your valuation has been sent to your email.',
    required: false,
  })
  @IsOptional()
  @IsString()
  successMessage?: string;

  @ApiProperty({
    example: 'https://example.com/thank-you',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  redirectUrl?: string;
}
