import { Module } from '@nestjs/common';
import { WidgetsController } from './widgets.controller';
import { WidgetsService } from './widgets.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { RentcastModule } from '../common/rentcast/rentcast.module';

@Module({
  imports: [PrismaModule, RentcastModule],
  controllers: [WidgetsController],
  providers: [WidgetsService],
  exports: [WidgetsService],
})
export class WidgetsModule {}
