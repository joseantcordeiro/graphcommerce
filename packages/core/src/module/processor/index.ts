import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SearchProcessor } from '../../processor/search';
import { MailProcessor } from '../../processor/mail';
import { PersonProcessor } from '../../processor/person';
import { PictureProcessor } from '../../processor/picture';
import { OrganizationProcessor } from '../../processor/organization';
import { RegionProcessor } from '../../processor/region';
import { ChannelService } from '../../service/channel';
import { MemberProcessor } from '../../processor/member';

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
		BullModule.registerQueue({
      name: 'member',
    }),
  ],
  controllers: [],
  providers: [PersonProcessor,
		MailProcessor,
		PictureProcessor,
		SearchProcessor,
		OrganizationProcessor,
		MemberProcessor,
		RegionProcessor,
		ChannelService
	],
})
export class ProcessorQueueModule {}