import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ChannelProcessor } from '../../processor/channel';
import { MailProcessor } from '../../processor/mail';
import { PersonProcessor } from '../../processor/person';
import { PictureProcessor } from '../../processor/picture';
import { TeamProcessor } from '../../processor/team';
import { OrganizationProcessor } from '../../processor/organization';
import { RegionProcessor } from '../../processor/region';
import { CategoryProcessor } from '../../processor/category';
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
      name: 'channel',
    }),
		BullModule.registerQueue({
      name: 'organization',
    }),
		BullModule.registerQueue({
      name: 'team',
    }),
		BullModule.registerQueue({
      name: 'region',
    }),
		BullModule.registerQueue({
      name: 'category',
    }),
  ],
  controllers: [],
  providers: [PersonProcessor,
		MailProcessor,
		PictureProcessor,
		ChannelProcessor,
		OrganizationProcessor,
		TeamProcessor,
		RegionProcessor,
		CategoryProcessor,
		ChannelService
	],
})
export class ProcessorQueueModule {}