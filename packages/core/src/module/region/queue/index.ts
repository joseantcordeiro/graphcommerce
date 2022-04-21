import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RegionProcessor } from '../../../processor/region';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'region',
    }),
  ],
  controllers: [],
  providers: [RegionProcessor],
})
export class RegionQueueModule {}