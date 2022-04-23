import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CategoryProcessor } from '../../../processor/category';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'category',
    }),
  ],
  controllers: [],
  providers: [CategoryProcessor],
})
export class CategoryQueueModule {}