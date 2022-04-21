import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ChannelProcessor } from '../../../processor/channel';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'channel',
    }),
  ],
  controllers: [],
  providers: [ChannelProcessor],
})
export class ChannelQueueModule {}