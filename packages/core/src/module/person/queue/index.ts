import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PersonProcessor } from '../../../processor/person';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'person',
    }),
		BullModule.registerQueue({
      name: 'picture',
    }),
		BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  controllers: [],
  providers: [PersonProcessor],
})
export class PersonQueueModule {}