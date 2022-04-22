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
import { InjectQueue } from '@nestjs/bull';
import { ChannelService } from '../../service/channel';
import { CreateChannelDto } from '../../dto/channel/create';
import { UpdateChannelDto } from '../../dto/channel/update';
import { AuthGuard } from '../../guard/auth';
import { RolesGuard } from '../../guard/role';
import { Role } from '../../enum/role';
import { Roles } from '../../decorator/role';
import { Session } from '../../decorator/session';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { DeleteChannelDto } from '../../dto/channel/delete';
import { GetChannelDto } from '../../dto/channel/get';


@Controller('channel')
@UseInterceptors(CacheInterceptor)
export class ChannelController {
  	constructor(@InjectQueue('channel') private readonly channelQueue: Queue,
		private readonly channelService: ChannelService) {}

  @Get()
  @UseGuards(AuthGuard)
	@Roles(Role.MANAGE_ORGANIZATION, Role.MANAGE_CHANNELS)
	@UseGuards(RolesGuard)
  async getChannel(@Body() properties: GetChannelDto,) {
    const channels = await this.channelService.get(properties);
		if (Array.isArray(channels)) {
			return {
				channels: channels.map(m => m.toJson()),
			};
		}
		throw new HttpException('Channel not found!', HttpStatus.NOT_FOUND);
  }

	@Get('list')
  @UseGuards(AuthGuard)
  async listChannels(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    const channels = await this.channelService.list(userId);
		if (Array.isArray(channels)) {
			return {
				channels: channels.map(m => m.toJson()),
			};
		}
		throw new HttpException('You is not a manager of any channel', HttpStatus.NOT_FOUND);
  }

  @Post()
  @UseGuards(AuthGuard)
	@Roles(Role.MANAGE_ORGANIZATION, Role.MANAGE_CHANNELS)
	@UseGuards(RolesGuard)
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
			this.channelQueue.add('create', {
				channel: channels.map(m => m.toJson()),
			});
			return {
				channels: channels.map(m => m.toJson()),
			};
		}
		throw new HttpException('Channel couldn\'t be created', HttpStatus.NOT_MODIFIED);
  }

  @Patch()
  @UseGuards(AuthGuard)
	@Roles(Role.MANAGE_ORGANIZATION, Role.MANAGE_CHANNELS)
	@UseGuards(RolesGuard)
  async patchChannel(
    @Session() session: SessionContainer,
    @Body() properties: UpdateChannelDto,
  ) {
    const userId = session.getUserId();
		const channels = await this.channelService.update(properties);
		if (Array.isArray(channels)) {
			this.channelQueue.add('update', {
				channel: channels.map(m => m.toJson()),
			});
			return {
				channels: channels.map(m => m.toJson()),
			};
		}
		throw new HttpException('Organization couldn\'t be updated', HttpStatus.NOT_MODIFIED);
  }

  @Delete()
  @UseGuards(AuthGuard)
	@Roles(Role.MANAGE_ORGANIZATION, Role.MANAGE_CHANNELS)
	@UseGuards(RolesGuard)
  async deleteChannel(@Session() session: SessionContainer,
		@Body() properties: DeleteChannelDto,
	) {
    const userId = session.getUserId();
    const channels = this.channelService.delete(properties);
		if (Array.isArray(channels)) {
			this.channelQueue.add('delete', {
				userId: userId, channelId: properties.channelId, targetChannelId: properties.targetChannelId,
			});
			return {
				message: 'Channel marked to delete',
				channels: channels.map(c => c.toJson()),
			}
		}
		throw new HttpException('Channel couldn\'t be deleted', HttpStatus.NOT_MODIFIED);
	}
}
