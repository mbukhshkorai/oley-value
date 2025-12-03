import { Module } from '@nestjs/common';
import { SmtpController } from './smtp.controller';
import { SmtpService } from './smtp.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { EmailModule } from '../common/email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [SmtpController],
  providers: [SmtpService],
  exports: [SmtpService],
})
export class SmtpModule {}
