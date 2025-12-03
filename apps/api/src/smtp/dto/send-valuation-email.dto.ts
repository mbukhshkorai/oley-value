import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendValuationEmailDto {
  @ApiProperty({ example: 'val_123456789' })
  @IsString()
  valuationId: string;

  @ApiProperty({ example: 'client@example.com' })
  @IsEmail()
  recipientEmail: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiProperty({
    example: "Here's the valuation you requested. Let me know if you have any questions!",
    required: false,
  })
  @IsOptional()
  @IsString()
  customMessage?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  includePdf?: boolean;
}
