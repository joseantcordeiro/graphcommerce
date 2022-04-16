import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreateOrganizationDto } from '../../dto/organization/create';
import { UpdateOrganizationDto } from '../../dto/organization/update';
import { Organization } from '../../entity/organization';

@Injectable()
export class OrganizationService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async get(userId: string): Promise<Organization[] | any> {
    const res = await this.neo4jService
      .read(
        `
			  MATCH (p:Person { id: $userId })-[:WORKS_AT]->(o:Organization)
			  RETURN o
			  `,
        { userId },
      );
			return res.records.length ? res.records.map((row) => new Organization(row.get('o'))) : {};
  }

	async getOrganizationRoles(userId: string, organizationId: string): Promise<string[]> {
		const res = await this.neo4jService.read(
			`
					MATCH (p:Person { id: $userId })-[r:WORKS_AT]->(o:Organization { id: $organizationId })
					RETURN r.role
				`,
			{ userId, organizationId },
		);
		return res.records.length ? res.records[0].get('r.role') : [];
	}

  async create(
    userId: string,
    properties: CreateOrganizationDto,
  ): Promise<Organization[] | any> {
    const res = await this.neo4jService.write(
      `
			MATCH (p:Person {id: $userId}), (a:Currency { code: $properties.defaultCurrency }), (c:Country { iso_2: $properties.defaultCountry }), (l:Language { alpha_2: $properties.defaultLanguage })
			WITH p, a, c, l, randomUUID() AS uuid
			CREATE (o:Organization { id: uuid })
			SET o.name = $properties.name
			CREATE (p)-[:OWNS { createdAt: datetime() }]->(o)
			CREATE (p)-[:WORKS_AT { role: ['MANAGE_ORGANIZATION'], since: datetime() }]->(o)
			CREATE (c)-[:DEFAULT_COUNTRY]->(o)
			CREATE (a)-[:DEFAULT_CURRENCY]->(o)
			CREATE (l)-[:DEFAULT_LANGUAGE]->(o)
			RETURN o
	  `,
      {
        userId,
        properties,
      },
    );

		return res.records.length ? res.records.map((row) => new Organization(row.get('o'))) : {};

  }

  async update(
    properties: UpdateOrganizationDto,
  ): Promise<Organization[] | any> {
    const res = await this.neo4jService.write(
      `
		MATCH (p:Person)-[r:OWNS]->(o {id: $properties.organizationId})
		WITH o, p, r
		SET o.name = $properties.name
		SET r.updatedAt = datetime()
		RETURN o
	  `,
      {
        properties,
      },
    );

    return res.records.length ? res.records.map((row) => new Organization(row.get('o'))) : {};
  }

  async delete(userId: string): Promise<any> {
    return this.neo4jService.write(
      `
			MATCH (p:Person {id: $userId})-[r:OWNS]->(o:Organization)
			DETACH DELETE o
			`,
      {
        userId,
      },
    );
  }
}
