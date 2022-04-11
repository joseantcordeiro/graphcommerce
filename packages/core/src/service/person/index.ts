import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreatePersonDto } from '../../dto/person/create';
import { UpdatePersonDto } from '../../dto/person/update';
import { PersonCreatedEvent } from '../../event/person/created';
import { Person } from '../../entity/person';

@Injectable()
export class PersonService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  /** 
  async userTeams(userId: string): Promise<Response | undefined> {
    const res = await this.neo4jService.read(
      `
			MATCH (u:User {id: $userId})
			RETURN u,
						 [(u)-[:WORKS_AT]->(t:Team) | t.id] AS teams
        `,
      { userId },
    );
    if (res.records.length) {
      const team = res.records.map((row) => new Response(row.get('teams')));
      return team;
    } else {
      return undefined;
    }
  }
*/

  async get(userId: string): Promise<Person | undefined> {
    const res = await this.neo4jService.read(
      `
					MATCH (p:Person {id: $userId})
					RETURN p
			`,
      { userId },
    );
    return res.records.length ? new Person(res.records[0].get('p')) : undefined;
  }

  async find(email: string): Promise<Person | undefined> {
    const res = await this.neo4jService.read(
      `
            MATCH (p:Person {email: $email})
            RETURN p
        `,
      { email },
    );
    return res.records.length ? new Person(res.records[0].get('p')) : undefined;
  }

  async create(properties: CreatePersonDto): Promise<Person | undefined> {
    const personCreated = this.neo4jService
      .write(
        `
						MATCH (l:Language { alpha_2: $.properties.defaultLanguage })
						WITH l
            CREATE (p:Person { id: $properties.userId })
            SET u += $properties
						CREATE (p)-[:WORKS_AT { since: datetime() }]->(o:Organization { id: $properties.organizationId })
						CREATE (l)-[:DEFAULT_LANGUAGE]->(p)
            RETURN p
        `,
        {
          properties,
        },
      )
      .then((res) => new Person(res.records[0].get('p')));

    // Emit People Created Event
    const personCreatedEvent = new PersonCreatedEvent();
    personCreatedEvent.id = (await personCreated).getId();
    this.eventEmitter.emit('person.created', personCreatedEvent);
    return personCreated;
  }

  async update(properties: UpdatePersonDto): Promise<Person | undefined> {
    const res = await this.neo4jService.write(
      `
            MATCH (p:Person { id: $properties.userId })
            SET p.name = $properties.name, p.updatedAt = datetime()
            RETURN p
        `,
      { properties },
    );
    // TODO: Emit Person Updated Event
    return new Person(res.records[0].get('p'));
  }

  async updateStaff(
    userId: string,
    properties: UpdatePersonDto,
  ): Promise<Person | undefined> {
    const res = await this.neo4jService.write(
      `
            MATCH (p:Person { id: $properties.userId })
            SET p.name = $properties.name, p.updatedAt = datetime()
            RETURN p
        `,
      { userId, properties },
    );
    // TODO: Emit Person Updated Event
    return new Person(res.records[0].get('p'));
  }

  async delete(userId: string): Promise<any> {
    // TODO: Emit Person Deleted Event
    return this.neo4jService.write(
      `
					MATCH (p:Person { id: $userId })
					DETACH DELETE p
				`,
      { userId },
    );
  }
}