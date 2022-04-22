import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SearchService } from '../../service/search';
import { Role } from '../../enum/role';
import { Roles } from '../../decorator/role';
import { RolesGuard } from '../../guard/role';
import { AuthGuard } from '../../guard/auth';
import { CreateIndexDto } from '../../dto/search/index/create';

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
}