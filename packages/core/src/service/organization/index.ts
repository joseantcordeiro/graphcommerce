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
			return res.records.length ? res.records.map((row) => new Organization(row.get('o'))) : false;
  }

	async getOrganizationRoles(userId: string): Promise<string[]> {
		const res = await this.neo4jService.read(
			`
					MATCH (p:Person { id: $userId })-[r:WORKS_AT { default: true }]->(o:Organization)
					RETURN r.role
				`,
			{ userId },
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
			CREATE (p)-[:WORKS_AT { role: ['MANAGE_ORGANIZATION'], default: false, since: datetime() }]->(o)
			CREATE (o)-[:HAS_DEFAULT_COUNTRY]->(c)
			CREATE (o)-[:HAS_DEFAULT_CURRENCY]->(a)
			CREATE (o)-[:HAS_DEFAULT_LANGUAGE]->(l)
			RETURN o
	  `,
      {
        userId,
        properties,
      },
    );

		return res.records.length ? res.records.map((row) => new Organization(row.get('o'))) : false;

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

    return res.records.length ? res.records.map((row) => new Organization(row.get('o'))) : false;
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
