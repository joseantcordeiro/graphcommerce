import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateTeamDto } from '../../dto/team/create';
import { UpdateTeamDto } from '../../dto/team/update';
/** import { AddUserTeamDto } from './dto/addUser-team.dto';
import { RemoveUserTeamDto } from './dto/removeUser-team.dto'; */
import { TeamService } from '../../service/team';
import { AuthGuard } from '../../guard/auth';
import { Session } from '../../decorator/session';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @UseGuards(AuthGuard)
  @Post()
  async postTeam(
    @Session() session: SessionContainer,
    @Body() properties: CreateTeamDto,
  ) {
		const userId = session.getUserId();
    const team = await this.teamService.create(
      userId,
      properties,
    );

    return {
      ...team.withMembers(),
    };
  }

  @UseGuards(AuthGuard)
  @Patch()
  async patchTeam(
		@Session() session: SessionContainer,
    @Body() properties: UpdateTeamDto,
  ) {
		const userId = session.getUserId();
		const roles = await this.teamService.getUserRoles(userId, properties.teamId);
		if (roles.includes('MANAGE_TEAM')) {
			const team = await this.teamService.update(properties);
			return {
				...team.toJson(),
			};
		}
		return {
			message: 'Unauthorized',
		};
  }

  @UseGuards(AuthGuard)
  @Get()
  async getTeam(@Session() session: SessionContainer) {
		const userId = session.getUserId();
    const teams = await this.teamService.get(userId);

    return {
			teams: teams.map(m => m.toJson()),
    };
  }

	@UseGuards(AuthGuard)
  @Get('id')
  async getTeamById(@Session() session: SessionContainer, @Body() properties: { teamId: string }) {
		const userId = session.getUserId();
    const team = await this.teamService.getById(properties.teamId);

    return {
			...team.withMembers(),
    };
  }

	/**
  @UseGuards(AuthGuard)
  @Post(':teamId/user')
  async postTeamUser(
    @Param('teamId') teamId: string,
    @Body() properties: AddUserTeamDto,
  ) {
    const team = await this.teamService.addUser(teamId, properties);

    return {
      ...team.toJson(),
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':teamId/user')
  async deleteTeamUser(
    @Param('teamId') teamId: string,
    @Body() properties: RemoveUserTeamDto,
  ) {
    const team = await this.teamService.removeUser(teamId, properties);

    return {
      ...team.toJson(),
    };
  } */
}
