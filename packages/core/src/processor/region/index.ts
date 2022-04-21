import { OnGlobalQueueCompleted, OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/** var sharp = require('sharp');
var request = require('request').defaults({encoding: null}); */

@Processor('region')
export class RegionProcessor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

	@Process('update')
  async update(job: Job<unknown>) {
    this.logger.info(`[RegionProcessor] Job ${job.id}-update process. Data:`, job.data);
    return {};
  }

	@Process('create')
  async create(job: Job<unknown>) {
    this.logger.info(`[RegionProcessor] Job ${job.id}-create process. Data:`, job.data);
    return {};
  }

	@Process('delete')
  async delete(job: Job<unknown>) {
    this.logger.info(`[RegionProcessor] Job ${job.id}-delete process. Data:`, job.data);
    return {};
  }

	@OnQueueActive()
	onActive(job: Job<unknown>) {
		this.logger.info(`[RegionProcessor] Job ${job.id}-${job.name} started. Data:`, job.data);
	}

	
	@OnGlobalQueueCompleted()
	async onGlobalCompleted(jobId: number, result: any) {
		// const job = await this.immediateQueue.getJob(jobId);
		this.logger.info('[RegionProcessor] (Global) on completed: job ', jobId, ' -> result: ', result);
	}

}