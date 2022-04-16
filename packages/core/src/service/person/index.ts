import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreatePersonDto } from '../../dto/person/create';
import { UpdatePersonDto } from '../../dto/person/update';
import { Person } from '../../entity/person';
import { MinioClientService } from '../minio-client';
import { BufferedFile } from '../../entity/file';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class PersonService {
  constructor(
		@InjectQueue('picture') private readonly pictureQueue: Queue,
		@InjectQueue('mail') private readonly mailQueue: Queue,
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

	async organization(userId: string): Promise<string | null> {
		const res = await this.neo4jService.read(
			`
			MATCH (p:Person { id: $userId })-[r:WORKS_AT]->(o:Organization)
			RETURN o.id AS organizationId
			`,
		 { userId },
		);
		return res.records.length ? res.records[0].get('organizationId') : null;
	
	}
	
	async create(properties: CreatePersonDto): Promise<Person | undefined> {
    const personCreated = this.neo4jService
      .write(
        `
						MATCH (l:Language { alpha_2: $properties.defaultLanguage })
						WITH l
            CREATE (p:Person { id: $properties.userId })
            SET p.name = $properties.name, p.email = $properties.email, p.createdAt = datetime()
						CREATE (l)-[:DEFAULT_LANGUAGE]->(p)
            RETURN p
        `,
        {
          properties,
        },
      )
      .then((res) => new Person(res.records[0].get('p')));

		await this.mailQueue.add('welcome', {
				email: (await personCreated).getEmail(),
				name: (await personCreated).getName(),
		});

		return personCreated;

  }

  async createStaff(properties: CreatePersonDto): Promise<Person | undefined> {
    return this.neo4jService
      .write(
        `
						MATCH (l:Language { alpha_2: $.properties.defaultLanguage })
						WITH l
            CREATE (p:Person { id: $properties.userId })
            SET p.name = $properties.name, p.email = $properties.email, p.createdAt: datetime()
						CREATE (p)-[:WORKS_AT { since: datetime() }]->(o:Organization { id: $properties.organizationId })
						CREATE (l)-[:DEFAULT_LANGUAGE]->(p)
            RETURN p
        `,
        {
          properties,
        },
      )
      .then((res) => new Person(res.records[0].get('p')));

  }

  async update(properties: UpdatePersonDto): Promise<Person | undefined> {
    const res = await this.neo4jService.write(
      `
            MATCH (p:Person { id: $properties.userId })
            SET p.name = $properties.name, p.email = $properties.email, p.updatedAt = datetime()
            RETURN p
        `,
      { properties },
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

	async uploadPicture(userId: string, image: BufferedFile): Promise<any> {
		const uploaded_image = await this.minioClientService.upload(image);
		const picture = uploaded_image.url;

		const res = await this.neo4jService.write(
			`
					MATCH (p:Person { id: $userId })
					SET p.picture = $picture, p.updatedAt = datetime()
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
