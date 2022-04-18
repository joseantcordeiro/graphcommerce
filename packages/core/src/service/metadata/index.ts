import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Metadata } from '../../entity/metadata';
import { CreateMetadataDto } from '../../dto/metadata/create';
import { GetMetadataDto } from '../../dto/metadata/get';
import { DeleteMetadataDto } from '../../dto/metadata/delete';
import { UpdateMetadataDto } from '../../dto/metadata/update';

@Injectable()
export class MetadataService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async createMetadata(userId: string, properties: CreateMetadataDto): Promise<Metadata[] | any> {
		const res = await this.neo4jService.write(
			`MATCH (n) WHERE (n.id = $properties.objectId)
			 WITH n
			 CREATE (m:Metadata { key: $properties.key, value: $properties.value, private: $properties.private })
			 CREATE (n)-[:HAS_METADATA { addedBy: $userId, createdAt: datetime() }]->(m) 
			 RETURN m
			`,
			{	userId, properties },
		);
		return res.records.length ? res.records.map((row) => new Metadata(row.get('m'))) : {};

  }

	async deleteMetadata(properties: DeleteMetadataDto): Promise<any> {
		await this.neo4jService.write(
			`MATCH (n { id: $properties.objectId })-[r:HAS_METADATA]->(m:Metadata { key: $properties.key})
			 DETACH DELETE m
			`,
			{	properties },
		);
		return {};
	}

	async updateMetadata(properties: UpdateMetadataDto): Promise<Metadata[] | any> {
		const res = await this.neo4jService.write(
				`MATCH (n { id: $properties.objectId })-[r:HAS_METADATA]->(m:Metadata { key: $properties.key})
				 SET m.value = $properties.value, m.private = $properties.private
				 SET r.updatedAt = datetime()
				 RETURN m
				`,
				{	properties },
		);
		return res.records.length ? res.records.map((row) => new Metadata(row.get('m'))) : {};
	}

	async getMetadata(properties: GetMetadataDto): Promise<Metadata[] | any> {
		const res = await this.neo4jService.read(
				`MATCH (n { id: $properties.objectId })-[r:HAS_METADATA]->(m:Metadata { key: $properties.key })
				 RETURN m
				`,
				{	properties },
		);
		return res.records.length ? res.records.map((row) => new Metadata(row.get('m'))) : {};
	}

	async getPublicMetadata(properties: GetMetadataDto): Promise<Metadata[] | any> {
		const res = await this.neo4jService.read(
				`MATCH (n { id: $properties.objectId })-[:HAS_METADATA]->(m:Metadata { private: false})
				 RETURN m
				`,
				{	properties },
		);
		return res.records.length ? res.records.map((row) => new Metadata(row.get('m'))) : {};
	}

	async getPrivateMetadata(properties: GetMetadataDto): Promise<Metadata[] | any> {
		const res = await this.neo4jService.read(
				`MATCH (n { id: $properties.objectId })-[:HAS_METADATA]->(m:Metadata { private: true})
				 RETURN m
				`,
				{	properties },
		);
		return res.records.length ? res.records.map((row) => new Metadata(row.get('m'))) : {};
	}

}
