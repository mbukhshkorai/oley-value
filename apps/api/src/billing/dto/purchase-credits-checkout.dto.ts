import { IsString, IsUrl, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseCreditsCheckoutDto {
  @ApiProperty({
    example: 50,
    description: 'Number of credits to purchase',
  })
  @IsNumber()
  @Min(1)
  credits: number;

  @ApiProperty({
    example: 'https://app.valupro.com/billing/success',
    description: 'URL to redirect to after successful payment',
  })
  @IsString()
  @IsUrl()
  successUrl: string;

  @ApiProperty({
    example: 'https://app.valupro.com/billing/cancel',
    description: 'URL to redirect to if payment is canceled',
  })
  @IsString()
  @IsUrl()
  cancelUrl: string;
}
