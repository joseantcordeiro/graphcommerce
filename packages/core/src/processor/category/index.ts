import { OnQueueActive, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { Document } from 'meilisearch';
import { Neo4jService } from 'nest-neo4j/dist';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { SearchService } from '../../service/search';

@Processor('category')
export class CategoryProcessor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly neo4jService: Neo4jService,
		private readonly searchService: SearchService) {
	}

	getIndex(categoryId: string): Promise<string> {
		return this.neo4jService.read(
			`
			MATCH (c:Category { id: $categoryId })<-[:HAS_CATEGORY]-(o:Organization)
			RETURN o.id
			`,
			{ categoryId },
		).then((res) => {
			if (res.records.length) {
				return res.records[0].get('o.id');
			}
			return 'ERROR';
		});
		
	}

	@Process('update')
  async update(job: Job) {
    const doc: Document = job.data.category;
		let index = await this.getIndex(doc[0].id);
		if (index === 'ERROR')
			return;
		index = "category-" + index;
		return this.searchService.updateDocuments(index, [doc[0]]);
  }

	@Process('create')
  async create(job: Job): Promise<any> {
		const doc: Document = job.data.category;
		let index = await this.getIndex(doc[0].id);
		if (index === 'ERROR')
			return;
		index = "category-" + index;
		return this.searchService.addDocuments(index, [doc[0]]);
  }

	@Process('delete')
  async delete(job: Job): Promise<any> {
		const categoryId: string = job.data.categoryId;
		
		let index = await this.getIndex(categoryId);
		if (index === 'ERROR')
			return;
		index = "category-" + index;
		const doc = await this.searchService.searchDocuments(index, categoryId);
		return  {
			message: 'Category not deleted',
			doc: doc[0]
		}
		// return this.searchService.deleteDocument(index, doc.hits[0].id);
	}

	@OnQueueActive()
	onActive(job: Job) {
		this.logger.info(`[CategoryProcessor] Job ${job.id} started. Data:`, job.data);
	}

	@OnQueueCompleted()
	async onGlobalCompleted(jobId: number, result: any) {
		// const job = await this.immediateQueue.getJob(jobId);
		this.logger.info('[CategoryProcessor] (Global) on completed: job ', jobId, ' -> result: ', result);
	}

}