import { Module } from '@nestjs/common';
import { OrganizationService } from '../../service/organization';
import { OrganizationController } from '../../controller/organization';
import { BullModule } from '@nestjs/bull';

@Module({
	imports: [
		BullModule.registerQueue({
      name: 'organization',
    }),
	],
  providers: [OrganizationService],
  controllers: [OrganizationController]
})
export class OrganizationModule {}
