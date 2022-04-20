import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreatePersonDto } from '../../dto/person/create';
import { UpdatePersonDto } from '../../dto/person/update';
import { Person } from '../../entity/person';
import { MinioClientService } from '../minio-client';
import { BufferedFile } from '../../entity/file';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { FindPersonDto } from '../../dto/organization/find';
import { Organization } from '../../entity/organization';

@Injectable()
export class PersonService {
  constructor(
		@InjectQueue('picture') private readonly pictureQueue: Queue,
    private readonly neo4jService: Neo4jService,
		private minioClientService: MinioClientService,
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

  async get(userId: string): Promise<Person[] | any> {
    const res = await this.neo4jService.read(
      `
					MATCH (p:Person {id: $userId})
					RETURN p
			`,
      { userId },
    );
    return res.records.length ? res.records.map((row) => new Person(row.get('p'))) : false;
  }

  async find(properties: FindPersonDto): Promise<Person[] | boolean> {
    const res = await this.neo4jService.read(
      `
            MATCH (p:Person {email: $properties.email})-[:WORKS_IN]->(o:Organization {id: $properties.organizationId})
            RETURN p
        `,
      { properties },
    );

    return res.records.length ? res.records.map((row) => new Person(row.get('p'))) : false;
  }

	async organization(userId: string): Promise<Organization[] | any> {
		const res = await this.neo4jService.read(
			`
			MATCH (p:Person { id: $userId })-[r:WORKS_AT { default: true }]->(o:Organization)
			RETURN o
			`,
		 { userId },
		);
		return res.records.length ? res.records.map((row) => new Organization(row.get('o'))) : false;
	
	}

	async makeDefaultOrganization(userId: string, organizationId: string): Promise<Organization[] | any> {
		const res = await this.neo4jService.write(
			`
			MATCH (p:Person { id: $userId })-[r0:WORKS_AT { default: true }]->(o0:Organization)
			SET r0.default = false
			WITH p
			MATCH (p)-[r1:WORKS_AT]->(o1:Organization { id: $organizationId })
			SET r1.default = true
			RETURN o1
			`,
			{ userId, organizationId },
		);
		return res.records.length ? res.records.map((row) => new Organization(row.get('o1'))) : false;
	}

	async create(properties: CreatePersonDto): Promise<Person[] | any> {
    const res = await this.neo4jService
      .write(
        `
						MATCH (l:Language { alpha_2: $properties.defaultLanguage })
						WITH l
            CREATE (p:Person { id: $properties.userId })
            SET p.name = $properties.name, p.email = $properties.email
						CREATE (p)-[:HAS_DEFAULT_LANGUAGE]->(l)
            RETURN p
        `,
        {
          properties,
        },
      );

		return res.records.length ? res.records.map((row) => new Person(row.get('p'))) : false;
  }

  async createStaff(properties: CreatePersonDto): Promise<Person | undefined> {
    return this.neo4jService
      .write(
        `
						MATCH (l:Language { alpha_2: $.properties.defaultLanguage })
						WITH l
            CREATE (p:Person { id: $properties.userId })
            SET p.name = $properties.name, p.email = $properties.email, p.createdAt: datetime()
						CREATE (p)-[:WORKS_IN { since: datetime() }]->(o:Organization { id: $properties.organizationId })
						CREATE (p)-[:HAS_DEFAULT_LANGUAGE]->(l)
            RETURN p
        `,
        {
          properties,
        },
      )
      .then((res) => new Person(res.records[0].get('p')));

  }

  async update(properties: UpdatePersonDto): Promise<Person[] | any> {
    const res = await this.neo4jService.write(
      `
            MATCH (p:Person { id: $properties.userId })-[r:WORKS_IN]->(o:Organization { id: $properties.organizationId })
						WITH p, r
            SET p.name = $properties.name, p.email = $properties.email
						SET r.updatedAt = datetime()
            RETURN p
        `,
      { properties },
    );
    // TODO: Emit Person Updated Event
    return res.records.length ? res.records.map((row) => new Person(row.get('p'))) : false;
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

	async uploadPicture(userId: string, image: BufferedFile): Promise<any> {
		const uploaded_image = await this.minioClientService.upload(image);
		const picture = uploaded_image.url;

		const res = await this.neo4jService.write(
			`
					MATCH (p:Person { id: $userId })
					SET p.picture = $picture
					RETURN p.picture AS profile_picture
				`,
			{ userId, picture },
		);

		await this.pictureQueue.add('resize', {
      file: res.records[0].get('profile_picture'),
    });

		return {
			profile_picture: res.records[0].get('profile_picture'),
			message: "Profile picture updated successfully."
		};
	}
}
