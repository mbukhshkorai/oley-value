import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortalSessionDto {
  @ApiProperty({
    example: 'https://app.valupro.com/billing',
    description: 'URL to return to after managing subscription',
  })
  @IsString()
  @IsUrl()
  returnUrl: string;
}
