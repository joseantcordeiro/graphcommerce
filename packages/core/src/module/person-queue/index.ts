import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PersonProcessor } from '../../processor/person';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'person',
    }),
  ],
  controllers: [],
  providers: [PersonProcessor],
})
export class PersonQueueModule {}