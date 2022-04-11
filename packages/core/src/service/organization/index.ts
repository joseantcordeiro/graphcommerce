import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreateOrganizationDto } from '../../dto/organization/create';
import { UpdateOrganizationDto } from '../../dto/organization/update';
import { Organization } from '../../entity/organization';

@Injectable()
export class OrganizationService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async get(userId: string): Promise<Organization[] | undefined> {
    return this.neo4jService
      .read(
        `
			  MATCH (p:Person { id: $userId })
			  RETURN [ (p)-[:WORKS_AT]->(o:Organization) | o ] AS organizations
			  `,
        { userId },
      )
      .then((res) =>
        res.records.map((row) => new Organization(row.get('organizations'))),
      );
  }

  async create(
    userId: string,
    properties: CreateOrganizationDto,
  ): Promise<Organization | undefined> {
    const res = await this.neo4jService.write(
      `
			MATCH (p:Person {id: $userId}), (a:Currency { code: $properties.defaultCurrency }), (c:Country { iso_2: $properties.defaultCountry }), (l:Language { alpha_2: $properties.defaultLanguage })
			WITH p, a, c, l, randomUUID() AS uuid
			CREATE (o:Organization { id: uuid })
			SET o.name = $properties.name, o.slug = apoc.text.decapitalizeAll(apoc.text.slug($properties.name +' '+ uuid))
			CREATE (p)-[:CREATED { createdAt: datetime() }]->(o)
			CREATE (p)-[:WORKS_AT { role: 'MANAGE_ORGANIZATION', since: datetime() }]->(o)
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
    if (!res) throw new NotFoundException();

    return new Organization(res.records[0].get('o'));
  }

  async update(
    userId,
    properties: UpdateOrganizationDto,
  ): Promise<Organization | undefined> {
    const res = await this.neo4jService.write(
      `
		[ (p:Person {id: $userId})-[r:CREATED]->(o:Organization {id: $properties.id}) | o]
		SET o += $properties, o.updatedAt = datetime()
		RETURN o
	  `,
      {
        userId,
        properties,
      },
    );

    if (!res) throw new NotFoundException();

    return new Organization(res.records[0].get('o'));
  }

  async delete(userId: string): Promise<void> {
    const res = await this.neo4jService.write(
      `
			[ (p:Person {id: $userId})-[r:CREATED]->(o:Organization) | o]
			DETACH DELETE o
			`,
      {
        userId,
      },
    );

    if (!res) throw new NotFoundException();
  }
}
