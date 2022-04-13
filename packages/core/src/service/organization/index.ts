import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreateOrganizationDto } from '../../dto/organization/create';
import { UpdateOrganizationDto } from '../../dto/organization/update';
import { Organization } from '../../entity/organization';
import { OrganizationCreatedEvent } from '../../event/organization/created';

@Injectable()
export class OrganizationService {
  constructor(
		private readonly neo4jService: Neo4jService,
		private readonly eventEmitter: EventEmitter2,
		) {}

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

	async getOrganizationRoles(userId: string, organizationId: string): Promise<string[] | undefined> {
		const res = await this.neo4jService.read(
			`
					MATCH (p:Person { id: $userId })-[r:WORKS_AT]->(o:Organization { id: $organizationId })
					RETURN r.role
				`,
			{ userId, organizationId },
		);
		return res.records.length ? res.records[0].get('r.role') : undefined;
	}

  async create(
    userId: string,
    properties: CreateOrganizationDto,
  ): Promise<Organization | undefined> {
    const organizationCreated = await this.neo4jService.write(
      `
			MATCH (p:Person {id: $userId}), (a:Currency { code: $properties.defaultCurrency }), (c:Country { iso_2: $properties.defaultCountry }), (l:Language { alpha_2: $properties.defaultLanguage })
			WITH p, a, c, l, randomUUID() AS uuid
			CREATE (o:Organization { id: uuid })
			SET o.name = $properties.name, o.createdAt = datetime()
			CREATE (p)-[:OWNS]->(o)
			CREATE (p)-[:WORKS_AT { role: ['MANAGE_ORGANIZATION', 'MANAGE_STAFF'], since: datetime() }]->(o)
			CREATE (c)-[:DEFAULT_COUNTRY]->(o)
			CREATE (a)-[:DEFAULT_CURRENCY]->(o)
			CREATE (l)-[:DEFAULT_LANGUAGE]->(o)
			RETURN o
	  `,
      {
        userId,
        properties,
      },
    )
		.then((res) => new Organization(res.records[0].get('o')));
    
		// Emit Organization Created Event
    const organizationCreatedEvent = new OrganizationCreatedEvent();
    organizationCreatedEvent.id = organizationCreated.getId();
    this.eventEmitter.emit('organization.created', organizationCreatedEvent);
    return organizationCreated;
  }

  async update(
    properties: UpdateOrganizationDto,
  ): Promise<Organization | undefined> {
    const res = await this.neo4jService.write(
      `
		MATCH (o:Organization {id: $properties.organizationId})
		SET o.name = $properties.name, o.updatedAt = datetime()
		RETURN o
	  `,
      {
        properties,
      },
    );

    return new Organization(res.records[0].get('o'));
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
