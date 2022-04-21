import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Category } from '../../entity/category';
import { CreateCategoryDto } from '../../dto/category/create';

@Injectable()
export class CategoryService {
  constructor(private readonly neo4jService: Neo4jService) {}
/** 
  async createCategory(userId: string, properties: CreateCategoryDto): Promise<Category[] | any> {
		const res = await this.neo4jService.write(
			`CREATE (c:Category { id: randomUUID(), name: $properties.name, description> $properties.description, seoTitle: $properties.seoTitle, seoDescription: $properties.seoDescription, seoKeywords: $properties.seoKeywords })
			 WITH c
			 CREATE (m:Metadata { key: $properties.key, value: $properties.value, private: $properties.private })
			 CREATE (n)-[:HAS_METADATA { addedBy: $userId, createdAt: datetime() }]->(m) 
			 RETURN m
			`,
			{	userId, properties },
		);
		return res.records.length ? res.records.map((row) => new Metadata(row.get('m'))) : {};

  }

	async deleteCategory(properties: DeleteCategoryDto): Promise<any> {
		await this.neo4jService.write(
			`MATCH (c:Category { id: '${properties.id}' })
			 DETACH DELETE c
			`,
			{	properties },
		);
		return {};
	}

	async updateCategory(properties: UpdateCategoryDto): Promise<Category[] | any> {
		const res = await this.neo4jService.write(
				`MATCH (c:Category { id: '${properties.id}' })
				 SET c.name = $properties.name, description = $properties.description, c.seoTitle = $properties.seoTitle, c.seoDescription = $properties.seoDescription, c.seoKeywords = $properties.seoKeywords
				 RETURN c
				`,
				{	properties },
		);
		return res.records.length ? res.records.map((row) => new Category(row.get('c'))) : {};
	}

	async getCategory(properties: GetCategoryDto): Promise<Category[] | any> {
		const res = await this.neo4jService.read(
				`MATCH (n { id: $properties.objectId })-[r:HAS_METADATA]->(m:Metadata { key: $properties.key })
				 RETURN m
				`,
				{	properties },
		);
		return res.records.length ? res.records.map((row) => new Category(row.get('m'))) : {};
	}
*/
}
