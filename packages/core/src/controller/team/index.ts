import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
	UseInterceptors,
} from '@nestjs/common';

import { CreateTeamDto } from '../../dto/team/create';
import { UpdateTeamDto } from '../../dto/team/update';
/** import { AddUserTeamDto } from './dto/addUser-team.dto';
import { RemoveUserTeamDto } from './dto/removeUser-team.dto'; */
import { TeamService } from '../../service/team';
import { AuthGuard } from '../../guard/auth';
import { Session } from '../../decorator/session';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('team')
@UseInterceptors(CacheInterceptor)
export class TeamController {
  constructor(@InjectQueue('team') private readonly teamQueue: Queue,
		private readonly teamService: TeamService) {}

  @UseGuards(AuthGuard)
  @Post()
  async postTeam(
    @Session() session: SessionContainer,
    @Body() properties: CreateTeamDto,
  ) {
		const userId = session.getUserId();
    const teams = await this.teamService.create(
      userId,
      properties,
    );

		if (Array.isArray(teams)) {
			this.teamQueue.add('create', {
				userId: userId, team: teams,
			});
			return {
				results: teams.map(m => m.toJson()),
			};
		}
		throw new HttpException('Team couldn\'t be created', HttpStatus.NOT_MODIFIED);
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
			const teams = await this.teamService.update(properties);
			if (Array.isArray(teams)) {
				this.teamQueue.add('update', {
					userId: userId, team: teams,
				});
				return {
					results: teams.map(m => m.toJson()),
				};
			}
			throw new HttpException('Team couldn\'t be updated', HttpStatus.NOT_MODIFIED);
		}
		throw new HttpException('You need to have the MANAGE_TEAM role', HttpStatus.FORBIDDEN);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getTeam(@Session() session: SessionContainer) {
		const userId = session.getUserId();
    const teams = await this.teamService.get(userId);

		if (Array.isArray(teams)) {
			return {
				results: teams.map(m => m.toJson()),
			};
		}
		throw new HttpException('You is not a member of any team', HttpStatus.NOT_FOUND);
  }

	@UseGuards(AuthGuard)
  @Get('id')
  async getTeamById(@Session() session: SessionContainer, @Body() properties: { teamId: string }) {
		const userId = session.getUserId();
    const teams = await this.teamService.getById(properties.teamId);

		if (Array.isArray(teams)) {
			return {
				results: teams.map(m => m.withMembers()),
			};
		}
		throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
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
