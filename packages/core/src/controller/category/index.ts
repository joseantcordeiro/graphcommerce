import { Body, CacheInterceptor, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateCategoryDto } from '../../dto/category/create';
import { CategoryService } from '../../service/category';
import { AuthGuard } from '../../guard/auth';
import { UpdateCategoryDto } from '../../dto/category/update';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ParentOfCategoryDto } from '../../dto/category/parent';

@Controller('category')
@UseInterceptors(CacheInterceptor)
export class CategoryController {
  constructor(@InjectQueue('search') private readonly searchQueue: Queue,
		private readonly categoryService: CategoryService) {}

  @Post()
	@UseGuards(AuthGuard)
  async postCategory(
    @Body() properties: CreateCategoryDto,
  ) {
    const category = await this.categoryService.createCategory(properties);
		if (Array.isArray(category)) {
			this.searchQueue.add('create', {
				objectType: 'category',
				object: category.map(m => m.toJson()),
			});
			return {
				category: category.map(m => m.toJson()),
			};
		}
		throw new HttpException('Category couldn\'t be added', HttpStatus.NOT_MODIFIED);
  }

  @Delete(':categoryId')
	@UseGuards(AuthGuard)
  async deleteMetadata(
    @Param('categoryId') categoryId: string,
  ) {
    const category = await this.categoryService.deleteCategory(categoryId);
		if (Array.isArray(category)) {
			this.searchQueue.add('delete', {
				objectType: 'category',
				object: category.map(m => m.toJson()),
			});
			return {
				message: 'Category marked to be deleted successfully',
				category: category.map(m => m.toJson()),
			};
		}
		throw new HttpException('Category couldn\'t be deleted', HttpStatus.NOT_MODIFIED);
  }

	@Patch()
	async updateMetadata(
		@Body() properties: UpdateCategoryDto,
	) {
		const category = await this.categoryService.updateCategory(properties);
		if (Array.isArray(category)) {
			this.searchQueue.add('update', {
				objectType: 'category',
				object: category.map(m => m.toJson()),
			});
			return {
				category: category.map(m => m.toJson()),
			};
		}
		throw new HttpException('Category couldn\'t be updated', HttpStatus.NOT_MODIFIED);
	}

  @Get(':categoryId')
	@UseGuards(AuthGuard)
  async getMetadata(
    @Param('categoryId') categoryId: string,
  ) {
    const category = await this.categoryService.getCategory(categoryId);
		if (Array.isArray(category)) {
			return {
				category: category.map(m => m.toJson()),
			};
		}
		throw new HttpException('CategoryId ${categoryId} couldn\'t be found', HttpStatus.NOT_FOUND);
  }

	@Get(':organizationId/organization')
	@UseGuards(AuthGuard)
	async getOrganizationCategories(
		@Param('organizationId') organizationId: string,
	) {
		const categories = await this.categoryService.getCategories(organizationId);
		if (Array.isArray(categories)) {
			return {
				categories: categories.map(m => m.toJson()),
			};
		}
		throw new HttpException('Categories couldn\'t be found', HttpStatus.NOT_FOUND);
	}

	@Patch('parent')
	@UseGuards(AuthGuard)
	async updateParent(
		@Body() properties: ParentOfCategoryDto,
	) {
		const category = await this.categoryService.parentOf(properties);
		if (Array.isArray(category)) {
			this.searchQueue.add('parent', {
				objectType: 'category',
				parentId: properties.parentId,
				object: category.map(m => m.toJson()),
			});
			return {
				category: category.map(m => m.toJson()),
			};
		}
		throw new HttpException('Category couldn\'t be updated', HttpStatus.NOT_MODIFIED);
	}

}