import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateRegionDto } from '../../dto/region/create';
import { RegionService } from '../../service/region';
import { Role } from '../../enum/role';
import { Roles } from '../../decorator/role';
import { RolesGuard } from '../../guard/role';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';import { AuthGuard } from '../../guard/auth';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService,
		@InjectQueue('region') private readonly regionQueue: Queue) {}

  @UseGuards(AuthGuard)
  @Post()
  async postRegion(@Body() properties: CreateRegionDto) {
    const regions = await this.regionService.create(properties);
		this.regionQueue.add('create', {
			region: regions,
		});
    return {
      ...regions.toJson(),
    };
  }
}
