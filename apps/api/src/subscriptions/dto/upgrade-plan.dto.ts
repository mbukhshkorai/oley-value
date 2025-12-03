import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpgradePlanDto {
  @ApiProperty({
    example: 'sub_1234567890',
    required: false,
    description: 'Stripe subscription ID',
  })
  @IsOptional()
  @IsString()
  stripeSubscriptionId?: string;
}
