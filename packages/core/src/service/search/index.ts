import { Injectable } from '@nestjs/common';
import EnqueuedUpdate, { Document, MeiliSearch, EnqueuedTask } from 'meilisearch';
import { InjectMeiliSearch } from '../../decorator/search';
import { CreateIndexDto } from '../../dto/search/index/create';

@Injectable()
export class SearchService {
  constructor(
    @InjectMeiliSearch() private readonly meiliSearchClient: MeiliSearch,
  ) {}

	async health(): Promise<any> {
		return this.meiliSearchClient.health();
	}

	async getIndexDocuments(index: string): Promise<any> {
		return (await this.meiliSearchClient.getIndex(index)).getDocuments();
	}

	async addIndex(properties: CreateIndexDto): Promise<EnqueuedTask> {
		const uid = properties.uid;
		const primaryKey = properties.primaryKey;
		return this.meiliSearchClient.createIndex(uid, { primaryKey: primaryKey });
	}

  async addDocuments(
    index: string,
    documents: Array<Document<any>>,
  ): Promise<any> {
		return this.meiliSearchClient.index(index).addDocuments(documents);
  }

  async getDocuments(index: string): Promise<any> {
    return (await this.meiliSearchClient.getIndex(index)).getDocuments();
  }

  async updateDocuments(
    index: string,
    documents: Array<Document<any>>,
  ): Promise<EnqueuedTask> {
    return this.meiliSearchClient.index(index).updateDocuments(documents);
  }

  async deleteDocument(index: string, docId: string): Promise<EnqueuedTask> {
    return this.meiliSearchClient.index(index).deleteDocument(docId);
  }
	
}
