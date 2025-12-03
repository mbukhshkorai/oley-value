import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AccountType {
  INDIVIDUAL_AGENT = 'INDIVIDUAL_AGENT',
  TEAM = 'TEAM',
  BROKERAGE = 'BROKERAGE',
}

export class SignupDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+15551234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: AccountType, example: AccountType.INDIVIDUAL_AGENT })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
