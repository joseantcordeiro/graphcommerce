import { Module } from '@nestjs/common';
import { TeamService } from '../../service/team';
import { TeamController } from '../../controller/team';
import { BullModule } from '@nestjs/bull';

@Module({
	imports: [
		BullModule.registerQueue({
      name: 'team',
    }),
	],
  providers: [TeamService],
  controllers: [TeamController]
})
export class TeamModule {}