import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutSessionDto {
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
