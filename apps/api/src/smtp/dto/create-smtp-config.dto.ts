import {
  IsString,
  IsNumber,
  IsEmail,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSmtpConfigDto {
  @ApiProperty({ example: 'smtp.gmail.com' })
  @IsString()
  host: string;

  @ApiProperty({ example: 587 })
  @IsNumber()
  port: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  secure?: boolean;

  @ApiProperty({ example: 'user@gmail.com', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'your-app-password', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'noreply@example.com' })
  @IsEmail()
  fromEmail: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fromName: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  oauth2Enabled?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  oauth2ClientId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  oauth2ClientSecret?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  oauth2AccessToken?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  oauth2RefreshToken?: string;
}
