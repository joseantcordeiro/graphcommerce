import { Body, CacheInterceptor, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateCategoryDto } from '../../dto/category/create';

import { CategoryService } from '../../service/category';
import { AuthGuard } from '../../guard/auth';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Controller('category')
@UseInterceptors(CacheInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
/**
  @Post()
	@UseGuards(AuthGuard)
  async postCategory(
		@Session() session: SessionContainer,
    @Body() properties: CreateCategoryDto,
  ) {
    const category = await this.categoryService.createCategory(userId, properties);
		if (Array.isArray(category)) {
			return {
				objectId: properties.objectId,
				category: category.map(m => m.toJson()),
			};
		}
		throw new HttpException('Category couldn\'t be added', HttpStatus.NOT_MODIFIED);
  }

  @Delete()
	@UseGuards(AuthGuard)
  async deleteMetadata(
    @Body() properties: DeleteCategoryDto,
  ) {
    await this.categoryService.deleteCategory(properties);
		return {
			objectId: properties.objectId,
			key: properties.key,
			message: 'Category deleted',
		}
  }

	@Patch()
	async updateMetadata(
		@Body() properties: UpdateCategoryDto,
	) {
		const category = await this.categoryService.updateCategory(properties);
		if (Array.isArray(category)) {
			return {
				objectId: properties.objectId,
				category: category.map(m => m.toJson()),
			};
		}
		throw new HttpException('Metadata couldn\'t be updated', HttpStatus.NOT_MODIFIED);
	}

  @Get()
	@UseGuards(AuthGuard)
  async getMetadata(
    @Body() properties: GetCategoryDto,
  ) {
    const category = await this.categoryService.getCategory(properties);
		if (Array.isArray(category)) {
			return {
				objectId: properties.objectId,
				category: category.map(m => m.toJson()),
			};
		}
		throw new HttpException('Category couldn\'t be found', HttpStatus.NOT_FOUND);
  }
 */
}