import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
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

	@Get()
	@UseGuards(AuthGuard)
	async get() {
		return this.searchService.health();
	}

	@Get('indexes/:index/documents')
	@UseGuards(AuthGuard)
	async getIndexDocuments(@Param('index') index: string) {
		return this.searchService.getIndexDocuments(index);
	}

	@Post('indexes')
	@UseGuards(AuthGuard)
	async addIndex(@Body() properties: CreateIndexDto) {
		return this.searchService.addIndex(properties);
	}

	@Post('indexes/:index/documents')
	@UseGuards(AuthGuard)
	async addDocuments(@Param('index') index: string, @Body() documents: any[]) {
		return this.searchService.addDocuments(index, documents);
	}

	@Get('indexes/:index/documents')
	@UseGuards(AuthGuard)
	async getDocuments(@Param('index') index: string) {
		return this.searchService.getDocuments(index);
	}

	@Get('tasks')
	@UseGuards(AuthGuard)
	async getTasks() {
		return this.searchService.getTasks();
	}

	@Get('tasks/:taskId')
	@UseGuards(AuthGuard)
	async getTask(@Param('taskId') taskId: number) {
		return this.searchService.getTask(taskId);
	}

	@Get('indexes/:indexId/tasks')
	@UseGuards(AuthGuard)
	async getIndexTasks(@Param('indexId') indexId: string) {
		return this.searchService.getIndexTasks(indexId);
	}

	@Get('indexes/:indexId/tasks/:taskId')
	@UseGuards(AuthGuard)
	async getIndexTask(@Param('indexId') indexId: string, @Param('taskId') taskId: number) {
		return this.searchService.getIndexTask(indexId, taskId);
	}

	@Get('indexes/:indexId/search')
	@UseGuards(AuthGuard)
	async search(@Param('indexId') indexId: string, @Body() query: SearchDocumentsDto) {
		return this.searchService.searchDocuments(indexId, query.q);
	}

	@Delete('indexes/:indexId')
	@UseGuards(AuthGuard)
	async deleteIndex(@Param('indexId') indexId: string) {
		return this.searchService.deleteIndex(indexId);
	}

}