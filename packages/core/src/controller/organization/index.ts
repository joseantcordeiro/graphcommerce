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
    const organization = await this.organizationService.create(
      userId,
      properties,
    );
    return {
      ...organization.toJson(),
    };
  }

  @Patch()
  @UseGuards(AuthGuard)
  async putOrganization(
    @Session() session: SessionContainer,
    @Body() properties: UpdateOrganizationDto,
  ) {
    const userId = session.getUserId();
    const organization = await this.organizationService.update(
      userId,
      properties,
    );
    return {
      ...organization.toJson(),
    };
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteOrganization(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    const organization = await this.organizationService.delete(userId);
    return {
      message: 'Organization deleted',
    };
  }
}
