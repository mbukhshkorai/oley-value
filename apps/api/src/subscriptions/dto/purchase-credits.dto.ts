import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseCreditsDto {
  @ApiProperty({
    example: 50,
    description: 'Number of additional credits to purchase',
  })
  @IsNumber()
  @Min(1)
  credits: number;

  @ApiProperty({
    example: 'pi_1234567890',
    required: false,
    description: 'Stripe payment intent ID',
  })
  @IsOptional()
  @IsString()
  stripePaymentIntentId?: string;
}
