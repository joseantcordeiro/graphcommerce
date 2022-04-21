import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Patch,
	HttpException,
	HttpStatus,
	UseInterceptors,
	CacheInterceptor,
} from '@nestjs/common';
import { Queue } from 'bull';
import { ChannelService } from '../../service/channel';
import { OrganizationService } from '../../service/organization';
/** import { CreateChannelDto } from '../../dto/channel/create';
import { UpdateChannelDto } from '../../dto/channel/update';
import { AuthGuard } from '../../guard/auth';
import { Session } from '../../decorator/session';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { DeleteChannelDto } from '../../dto/channel/delete';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OrganizationService } from '../../service/organization'; */

@Controller('channel')
@UseInterceptors(CacheInterceptor)
export class ChannelController {
  constructor(@InjectQueue('channel') private readonly channelQueue: Queue,
		private readonly channelService: ChannelService,
		private readonly organizationService: OrganizationService) {}
/**
  @Get()
  @UseGuards(AuthGuard)
  async getChannel(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    const channels = await this.channelService.get(userId);
		if (Array.isArray(channels)) {
			return {
				organizations: channels.map(m => m.toJson()),
			};
		}
		throw new HttpException('You is not a member of any organization', HttpStatus.NOT_FOUND);
  }

  @Post()
  @UseGuards(AuthGuard)
  async postChannel(
    @Session() session: SessionContainer,
    @Body() properties: CreateChannelDto,
  ) {
    const userId = session.getUserId();
    const channels = await this.channelService.create(
      userId,
      properties,
    );
		if (Array.isArray(channels)) {
			return {
				organizations: channels.map(m => m.toJson()),
			};
		}
		throw new HttpException('Channel couldn\'t be created', HttpStatus.NOT_MODIFIED);
  }

  @Patch()
  @UseGuards(AuthGuard)
  async patchChannel(
    @Session() session: SessionContainer,
    @Body() properties: UpdateChannelDto,
  ) {
    const userId = session.getUserId();
		const roles = await this.organizationService.getOrganizationRoles(userId, properties.organizationId);
		if (roles.includes('MANAGE_ORGANIZATION')) {
			const organizations = await this.channelService.update(properties);
			if (Array.isArray(organizations)) {
				await this.channelQueue.add('update', {
					userId: userId, channelId: properties.channelId,
				});
				return {
					organizations: organizations.map(m => m.toJson()),
				};
			}
			throw new HttpException('Organization couldn\'t be updated', HttpStatus.NOT_MODIFIED);
		}

		throw new HttpException('You need to have the MANAGE_ORGANIZATION role', HttpStatus.FORBIDDEN);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteChannel(@Session() session: SessionContainer,
		@Body() properties: DeleteChannelDto,
	) {
    const userId = session.getUserId();
    const channelDeleted = this.channelService.delete(properties.channelId);
		if (!Array.isArray(channelDeleted)) {
			throw new HttpException('Channel couldn\'t be deleted', HttpStatus.NOT_MODIFIED);
		}
		await this.channelQueue.add('delete', {
      userId: userId, channelId: properties.channelId, targetChannelId: properties.targetChannelId,
    });
		return {
			channel: channelDeleted.map(c => c.toJson()),
			message: 'Channel marked to deleted',
  	}
	} */
}
