import { Module } from '@nestjs/common';
import { TeamService } from '../../service/team';
import { TeamController } from '../../controller/team';

@Module({
  providers: [TeamService],
  controllers: [TeamController]
})
export class TeamModule {}