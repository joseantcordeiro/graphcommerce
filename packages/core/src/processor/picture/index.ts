import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Processor('picture')
export class PictureProcessor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  @Process('resize')
  handleResize(job: Job) {
    this.logger.info('Start resize...');
    this.logger.info('Data: ', job.data);
    this.logger.info('Resizing completed');
  }
}