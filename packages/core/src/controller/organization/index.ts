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
} from '@nestjs/common';
import { OrganizationService } from '../../service/organization';
import { CreateOrganizationDto } from '../../dto/organization/create';
import { UpdateOrganizationDto } from '../../dto/organization/update';
import { AuthGuard } from '../../guard/auth';
import { Session } from '../../decorator/session';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

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
			return {
				organizations: organizations.map(m => m.toJson()),
			};
		}
		throw new HttpException('Organization couldn\'t be created', HttpStatus.NOT_MODIFIED);
  }

  @Patch()
  @UseGuards(AuthGuard)
  async patchOrganization(
    @Session() session: SessionContainer,
    @Body() properties: UpdateOrganizationDto,
  ) {
    const userId = session.getUserId();
		const roles = await this.organizationService.getOrganizationRoles(userId, properties.organizationId);
		if (roles.includes('MANAGE_ORGANIZATION')) {
			const organizations = await this.organizationService.update(properties);
			if (Array.isArray(organizations)) {
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
  async deleteOrganization(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    return this.organizationService.delete(userId);
  }
}
