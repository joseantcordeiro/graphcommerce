import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { OrganizationProcessor } from '../../../processor/organization';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'organization',
    }),
  ],
  controllers: [],
  providers: [OrganizationProcessor],
})
export class OrganizationQueueModule {}