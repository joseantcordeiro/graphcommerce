import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PictureProcessor } from '../../processor/picture';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'picture',
    }),
  ],
  controllers: [],
  providers: [PictureProcessor],
})
export class PictureModule {}