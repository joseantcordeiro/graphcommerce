import { OnGlobalQueueCompleted, OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { Document } from 'meilisearch';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { SearchService } from '../../service/search';

@Processor('organization')
export class OrganizationProcessor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly searchService: SearchService) {}

	@Process('update')
  async update(job: Job) {
    const doc: Document = job.data.organization;
		const index = "organization";
		return this.searchService.updateDocuments(index, [doc[0]]);
  }

	@Process('create')
  async create(job: Job) {
		const doc: Document = job.data.organization;
		const index = "organization";
		return this.searchService.addDocuments(index, [doc[0]]);
  }

	@Process('delete')
  async delete(job: Job<unknown>) {
    this.logger.info(`[OrganizationProcessor] Job ${job.id}-delete process. Data:`, job.data);
    return {};
  }

	@OnQueueActive()
	onActive(job: Job) {
		this.logger.info(`[OrganizationProcessor] Job ${job.id}-${job.name} started. Data:`, job.data);
	}
	
	@OnGlobalQueueCompleted()
	async onGlobalCompleted(jobId: number, result: any) {
		// const job = await this.immediateQueue.getJob(jobId);
		this.logger.info('[OrganizationProcessor] (Global) on completed: job ', jobId, ' -> result: ', result);
	}

}