import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { OrganizationService } from '../../service/organization';
import { CreateOrganizationDto } from '../../dto/organization/create';
import { UpdateOrganizationDto } from '../../dto/organization/update';
import { AuthGuard } from '../../guard/auth';
import { Session } from '../../decorator/session';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { PersonService } from '../../service/person';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getOrganization(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    const organizations = await this.organizationService.get(userId);
    return {
      ...organizations,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  async postOrganization(
    @Session() session: SessionContainer,
    @Body() properties: CreateOrganizationDto,
  ) {
    const userId = session.getUserId();
    return this.organizationService.create(
      userId,
      properties,
    );
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
			return this.organizationService.update(properties);
		}
		return {
			message: 'Unauthorized',
		};
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteOrganization(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    return this.organizationService.delete(userId);
  }
}
