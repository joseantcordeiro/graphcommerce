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
import { OrganizationService } from '../../service/organization';
import { CreateOrganizationDto } from '../../dto/organization/create';
import { UpdateOrganizationDto } from '../../dto/organization/update';
import { AuthGuard } from '../../guard/auth';
import { Session } from '../../decorator/session';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Role } from '../../enum/role';
import { Roles } from '../../decorator/role';
import { RolesGuard } from '../../guard/role';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';


@Controller('organization')
@UseInterceptors(CacheInterceptor)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService,
		@InjectQueue('organization') private readonly organizationQueue: Queue,
		) {}

  @Get()
  @UseGuards(AuthGuard)
  async getOrganization(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    const organizations = await this.organizationService.get(userId);
		if (Array.isArray(organizations)) {
			return {
				organizations: organizations.map(m => m.toJson()),
			};
		}
		throw new HttpException('You is not a member of any organization', HttpStatus.NOT_FOUND);
  }

  @Post()
  @UseGuards(AuthGuard)
  async postOrganization(
    @Session() session: SessionContainer,
    @Body() properties: CreateOrganizationDto,
  ) {
    const userId = session.getUserId();
    const organizations = await this.organizationService.create(
      userId,
      properties,
    );
		if (Array.isArray(organizations)) {
			this.organizationQueue.add('create', {
				organization: organizations.map(m => m.toJson()),
			});
			return {
				organizations: organizations.map(m => m.toJson()),
			};
		}
		throw new HttpException('Organization couldn\'t be created', HttpStatus.NOT_MODIFIED);
  }

  @Patch()
  @UseGuards(AuthGuard)
	@Roles(Role.MANAGE_ORGANIZATION)
	@UseGuards(RolesGuard)
  async patchOrganization(
    @Body() properties: UpdateOrganizationDto,
  ) {
			const organizations = await this.organizationService.update(properties);
			if (Array.isArray(organizations)) {
				this.organizationQueue.add('update', {
					organization: organizations.map(m => m.toJson()),
				});
				return {
					organizations: organizations.map(m => m.toJson()),
				};
			}
			throw new HttpException('Organization couldn\'t be updated', HttpStatus.NOT_MODIFIED);

  }

  @Delete()
  @UseGuards(AuthGuard)
	@Roles(Role.MANAGE_ORGANIZATION)
	@UseGuards(RolesGuard)
  async deleteOrganization(@Session() session: SessionContainer) {
    const userId = session.getUserId();
		this.organizationQueue.add('delete', {
			userId: userId,
		});
    return this.organizationService.delete(userId);
  }
}
