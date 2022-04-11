import { Module } from '@nestjs/common';
import { OrganizationService } from '../../service/organization';
import { OrganizationController } from '../../controller/organization';

@Module({
  providers: [OrganizationService],
  controllers: [OrganizationController]
})
export class OrganizationModule {}
