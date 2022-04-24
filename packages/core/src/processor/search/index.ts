import { OnQueueActive, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { Document } from 'meilisearch';
import { Neo4jService } from 'nest-neo4j/dist';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { SearchService } from '../../service/search';

/** var sharp = require('sharp');
var request = require('request').defaults({encoding: null}); */

@Processor('search')
export class SearchProcessor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly neo4jService: Neo4jService,
		private readonly searchService: SearchService) {
	}

	getIndex(objectId: string): Promise<string> {
		return this.neo4jService.read(
			`
			MATCH (n { id: $objectId })-[:BELONGS_TO]->(o:Organization)
			RETURN o.id
			`,
			{ objectId },
		).then((res) => {
			if (res.records.length) {
				return res.records[0].get('o.id');
			}
			return 'ERROR';
		});
		
	}

	@Process('update')
  async update(job: Job) {
    const doc: Document = job.data.object;
		let index = await this.getIndex(doc[0].id);
		if (index === 'ERROR')
			return;
		index = job.data.objectType + '-' + index;
		return this.searchService.updateDocuments(index, [doc[0]]);
  }

	@Process('create')
  async create(job: Job): Promise<any> {
		const doc: Document = job.data.object;
		let index = await this.getIndex(doc[0].id);
		if (index === 'ERROR')
			return;
		index = job.data.objectType + '-' + index;
		return this.searchService.addDocuments(index, [doc[0]]);
  }

	@Process('delete')
  async delete(job: Job) {
    this.logger.info(`[SearchProcessor] Job ${job.id}-delete process. Data:`, job.data);
    return {};
  }

	@OnQueueActive()
	async onActive(job: Job<unknown>) {
		this.logger.info(`[SearchProcessor] Job ${job.id} started. Data:`, job.data);
	}

	@OnQueueCompleted()
	async onGlobalCompleted(jobId: number, result: any) {
		this.logger.info('[SearchProcessor] Job ' + jobId.toString() + ' Completed -> result: ', result);
	}

}