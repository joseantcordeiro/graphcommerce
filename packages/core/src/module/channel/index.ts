import { Module } from '@nestjs/common';
import { ChannelService } from '../../service/channel';
import { ChannelController } from '../../controller/channel';
import { MinioClientModule } from '../minio-client';
import { BullModule } from '@nestjs/bull';

@Module({
	imports: [
		MinioClientModule,
		BullModule.registerQueue({
      name: 'search',
    }),
	],
  providers: [ChannelService],
  controllers: [ChannelController],
	exports: [ChannelService],
})
export class ChannelModule {}