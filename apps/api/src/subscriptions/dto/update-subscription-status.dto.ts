import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus } from '@prisma/client';

export class UpdateSubscriptionStatusDto {
  @ApiProperty({
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
    description: 'New subscription status',
  })
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @ApiProperty({
    example: 'sub_1234567890',
    required: false,
    description: 'Stripe subscription ID',
  })
  @IsOptional()
  @IsString()
  stripeSubscriptionId?: string;
}
