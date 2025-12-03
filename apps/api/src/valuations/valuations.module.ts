import { Module } from '@nestjs/common';
import { ValuationsService } from './valuations.service';
import { ValuationsController } from './valuations.controller';
import { RentcastModule } from '../common/rentcast/rentcast.module';
import { PdfModule } from '../common/pdf/pdf.module';

@Module({
  imports: [RentcastModule, PdfModule],
  controllers: [ValuationsController],
  providers: [ValuationsService],
  exports: [ValuationsService],
})
export class ValuationsModule {}
