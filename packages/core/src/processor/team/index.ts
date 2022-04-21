import { OnGlobalQueueCompleted, OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/** var sharp = require('sharp');
var request = require('request').defaults({encoding: null}); */

@Processor('team')
export class TeamProcessor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

	@Process('update')
  async update(job: Job<unknown>) {
    this.logger.info(`[TeamProcessor] Job ${job.id}-update process. Data:`, job.data);
    return {};
  }

	@Process('create')
  async create(job: Job<unknown>) {
    this.logger.info(`[TeamProcessor] Job ${job.id}-create process. Data:`, job.data);
    return {};
  }

	@Process('delete')
  async delete(job: Job<unknown>) {
    this.logger.info(`[TeamProcessor] Job ${job.id}-delete process. Data:`, job.data);
    return {};
  }

	@OnQueueActive()
	onActive(job: Job) {
		this.logger.info(`[TeamProcessor] Job ${job.id}-${job.name} started. Data:`, job.data);
	}

	
	@OnGlobalQueueCompleted()
	async onGlobalCompleted(jobId: number, result: any) {
		// const job = await this.immediateQueue.getJob(jobId);
		this.logger.info('[TeamProcessor] (Global) on completed: job ', jobId, ' -> result: ', result);
	}

}