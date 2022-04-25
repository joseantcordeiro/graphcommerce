import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SearchProcessor } from '../../processor/search';
import { MailProcessor } from '../../processor/mail';
import { PersonProcessor } from '../../processor/person';
import { PictureProcessor } from '../../processor/picture';
import { OrganizationProcessor } from '../../processor/organization';
import { RegionProcessor } from '../../processor/region';
import { ChannelService } from '../../service/channel';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'person',
    }),
		BullModule.registerQueue({
      name: 'mail',
    }),
		BullModule.registerQueue({
      name: 'picture',
    }),
		BullModule.registerQueue({
      name: 'search',
    }),
		BullModule.registerQueue({
      name: 'organization',
    }),
		BullModule.registerQueue({
      name: 'region',
    }),
  ],
  controllers: [],
  providers: [PersonProcessor,
		MailProcessor,
		PictureProcessor,
		SearchProcessor,
		OrganizationProcessor,
		RegionProcessor,
		ChannelService
	],
})
export class ProcessorQueueModule {}