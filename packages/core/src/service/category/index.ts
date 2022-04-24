import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Category } from '../../entity/category';
import { CreateCategoryDto } from '../../dto/category/create';
import { UpdateCategoryDto } from '../../dto/category/update';

@Injectable()
export class CategoryService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async createCategory(properties: CreateCategoryDto): Promise<Category[] | any> {
		const res = await this.neo4jService.write(
			`MATCH (o:Organization { id: $properties.organizationId })
			 WITH o
			 CREATE (c:Category { id: randomUUID(), name: $properties.name, description: $properties.description, seoTitle: $properties.seoTitle, seoDescription: $properties.seoDescription, seoKeywords: $properties.seoKeywords })
			 CREATE (o)-[:HAS_CATEGORY { createdAt: datetime() }]->(c)
			 RETURN c
			`,
			{	properties },
		);
		return res.records.length ? res.records.map((row) => new Category(row.get('c'))) : false;

  }

	async deleteCategory(categoryId: string): Promise<any> {
		await this.neo4jService.write(
			`MATCH (c:Category { id: $categoryId })
			 DETACH DELETE c
			`,
			{	categoryId },
		);
		return {};
	}

	async updateCategory(properties: UpdateCategoryDto): Promise<Category[] | any> {
		const res = await this.neo4jService.write(
				`MATCH (c:Category { id: $properties.categoryId })
				 SET c.name = $properties.name, c.description = $properties.description, c.seoTitle = $properties.seoTitle, c.seoDescription = $properties.seoDescription, c.seoKeywords = $properties.seoKeywords
				 WITH c
				 MATCH (o:Organization)-[r:HAS_CATEGORY]->(c)
				 SET r.updatedAt = datetime()
				 RETURN c
				`,
				{	properties },
		);
		return res.records.length ? res.records.map((row) => new Category(row.get('c'))) : false;
	}

	async getCategory(categoryId: string): Promise<Category[] | any> {
		const res = await this.neo4jService.read(
				`MATCH (c:Category { id: $categoryId })
				 RETURN c
				`,
				{	categoryId },
		);
		return res.records.length ? res.records.map((row) => new Category(row.get('c'))) : false;
	}

	async getCategories(organizationId: string): Promise<Category[] | any> {
		const res = await this.neo4jService.read(
				`MATCH (o:Organization { id: $organizationId })-[:HAS_CATEGORY]->(c:Category)
				 RETURN c
				`,
				{	organizationId },
		);
		return res.records.length ? res.records.map((row) => new Category(row.get('c'))) : false;
	}

}
