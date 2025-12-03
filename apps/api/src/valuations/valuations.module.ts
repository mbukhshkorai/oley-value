import { Module } from '@nestjs/common';
import { ValuationsService } from './valuations.service';
import { ValuationsController } from './valuations.controller';
import { RentcastModule } from '../common/rentcast/rentcast.module';

@Module({
  imports: [RentcastModule],
  controllers: [ValuationsController],
  providers: [ValuationsService],
  exports: [ValuationsService],
})
export class ValuationsModule {}
