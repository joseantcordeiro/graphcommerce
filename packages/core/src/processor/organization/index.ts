import { OnQueueActive, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { Document } from 'meilisearch';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateChannelProcessDto } from '../../dto/channel/queue';
import { ChannelService } from '../../service/channel';
import { SearchService } from '../../service/search';

@Processor('organization')
export class OrganizationProcessor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly searchService: SearchService,
		private readonly channelService: ChannelService) {}

	/** @Process('update')
  async update(job: Job) {
    const doc: Document = job.data.organization;
		const index = "organization";
		return this.searchService.updateDocuments(index, [doc[0]]);
  }

	@Process('create')
  async create(job: Job) {
		const properties: CreateChannelProcessDto = {
			organizationId: job.data.organization[0].id,
			name: 'default-channel',
			active: true,
			currencyCode: 'usd',
			defaultCountry: 'us',
		};
		const channel = await this.channelService.create(properties);
		properties.channelId = channel.getId();
		const index = 'channel-' + properties.organizationId;
		return this.searchService.addDocuments(index, [properties]);
  } */

	@Process('delete')
  async delete(job: Job) {
    this.logger.info(`[OrganizationProcessor] Job ${job.id}-delete process. Data:`, job.data);
    return {};
  }

	@OnQueueActive()
	onActive(job: Job) {
		this.logger.info(`[OrganizationProcessor] Job ${job.id}-${job.name} started. Data:`, job.data);
	}
	
	@OnQueueCompleted()
	async onGlobalCompleted(jobId: number, result: any) {
		// const job = await this.immediateQueue.getJob(jobId);
		this.logger.info('[OrganizationProcessor] (Global) on completed: job ', jobId, ' -> result: ', result);
	}

}