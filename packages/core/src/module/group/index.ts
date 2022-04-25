import { Module } from '@nestjs/common';
import { GroupService } from '../../service/group';
import { GroupController } from '../../controller/group';
import { BullModule } from '@nestjs/bull';

@Module({
	imports: [
		BullModule.registerQueue({
      name: 'search',
    }),
	],
  providers: [GroupService],
  controllers: [GroupController],
	exports: [],
})
export class GroupModule {}