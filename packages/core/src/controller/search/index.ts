import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SearchService } from '../../service/search';
import { Role } from '../../enum/role';
import { Roles } from '../../decorator/role';
import { RolesGuard } from '../../guard/role';
import { AuthGuard } from '../../guard/auth';
import { CreateIndexDto } from '../../dto/search/index/create';
import { SearchDocumentsDto } from '../../dto/search/document/search';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

	@UseGuards(AuthGuard)
	@Get()
	async get() {
		return this.searchService.health();
	}

	@UseGuards(AuthGuard)
	@Get('indexes/:index/documents')
	async getIndexDocuments(@Param('index') index: string) {
		return this.searchService.getIndexDocuments(index);
	}

	@UseGuards(AuthGuard)
	@Post('indexes')
	async addIndex(@Body() properties: CreateIndexDto) {
		return this.searchService.addIndex(properties);
	}

	@UseGuards(AuthGuard)
	@Post('indexes/:index/documents')
	async addDocuments(@Param('index') index: string, @Body() documents: any[]) {
		return this.searchService.addDocuments(index, documents);
	}

	@UseGuards(AuthGuard)
	@Get('indexes/:index/documents')
	async getDocuments(@Param('index') index: string) {
		return this.searchService.getDocuments(index);
	}

	@UseGuards(AuthGuard)
	@Get('tasks')
	async getTasks() {
		return this.searchService.getTasks();
	}

	@UseGuards(AuthGuard)
	@Get('tasks/:taskId')
	async getTask(@Param('taskId') taskId: number) {
		return this.searchService.getTask(taskId);
	}

	@UseGuards(AuthGuard)
	@Get('indexes/:indexId/tasks')
	async getIndexTasks(@Param('indexId') indexId: string) {
		return this.searchService.getIndexTasks(indexId);
	}

	@UseGuards(AuthGuard)
	@Get('indexes/:indexId/tasks/:taskId')
	async getIndexTask(@Param('indexId') indexId: string, @Param('taskId') taskId: number) {
		return this.searchService.getIndexTask(indexId, taskId);
	}

	@UseGuards(AuthGuard)
	@Get('indexes/:indexId/search')
	async search(@Param('indexId') indexId: string, @Body() query: SearchDocumentsDto) {
		return this.searchService.searchDocuments(indexId, query.q);
	}

}