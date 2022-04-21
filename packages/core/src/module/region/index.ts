import { Module } from '@nestjs/common';
import { RegionService } from '../../service/region';
import { RegionController } from '../../controller/region';
import { BullModule } from '@nestjs/bull';

@Module({
	imports: [
		BullModule.registerQueue({
      name: 'region',
    }),
	],
  providers: [RegionService],
  controllers: [RegionController]
})
export class RegionModule {}