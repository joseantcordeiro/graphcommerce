import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TeamProcessor } from '../../../processor/team';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'team',
    }),
  ],
  controllers: [],
  providers: [TeamProcessor],
})
export class TeamQueueModule {}