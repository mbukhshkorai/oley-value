import { Module } from '@nestjs/common';
import { RentcastService } from './rentcast.service';

@Module({
  providers: [RentcastService],
  exports: [RentcastService],
})
export class RentcastModule {}
