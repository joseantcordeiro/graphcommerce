import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreateChannelDto } from '../../dto/channel/create';
import { GetChannelDto } from '../../dto/channel/get';
import { UpdateChannelDto } from '../../dto/channel/update';
import { Channel } from '../../entity/channel';

@Injectable()
export class ChannelService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async get(properties: GetChannelDto): Promise<Channel[] | any> {
    const res = await this.neo4jService
      .read(
        `
			  MATCH (c:Channel { id: $properties.channelId, deleted: false, active: true })
			  RETURN c
			  `,
        { properties },
      );
			return res.records.length ? res.records.map((row) => new Channel(row.get('c'))) : false;
  }

	async list(userId: string): Promise<Channel[] | any> {
		const res = await this.neo4jService.read(
			`
			MATCH (p:Person {id: $userId})-[:WORKS_AT { default: true }]->(o:Organization)
			WITH p, o
			MATCH (c:Channel { deleted: false, active: true })<-[:HAS_CHANNEL]-(o:Organization)
			RETURN c
			`,
			{ userId },
		);
		return res.records.length ? res.records.map((row) => new Channel(row.get('c'))) : false;
	}

  async create(
    userId: string,
    properties: CreateChannelDto,
  ): Promise<Channel[] | any> {
    const res = await this.neo4jService.write(
      `
			MATCH (p:Person {id: $userId})-[:WORKS_AT { default: true}]->(o:Organization),(a:Currency { code: $properties.defaultCurrency }), (c:Country { iso_2: $properties.defaultCountry })
			WITH p, o, a, c, randomUUID() AS uuid
			CREATE (m:Channel { id: uuid, name: $properties.name, active: $properties.active, deleted: false })
			CREATE (o)-[:HAS_CHANNEL { createdBy: $userId, createdAt: datetime() }]->(m)
			CREATE (m)-[:HAS_DEFAULT_COUNTRY]->(c)
			CREATE (m)-[:HAS_DEFAULT_CURRENCY]->(a)
			RETURN m
	  `,
      {
        userId,
        properties,
      },
    );

		return res.records.length ? res.records.map((row) => new Channel(row.get('m'))) : false;

  }

  async update(
    properties: UpdateChannelDto,
  ): Promise<Channel[] | any> {
    const res = await this.neo4jService.write(
      `
		MATCH (c:Channel {id: $properties.channelId})<-[r:HAS_CHANNEL]-(o:Organization)
		WITH c, r
		SET c.name = $properties.name, c.active = $properties.active
		SET r.updatedAt = datetime()
		RETURN c
	  `,
      {
        properties,
      },
    );
    return res.records.length ? res.records.map((row) => new Channel(row.get('c'))) : false;
  }

  async delete(properties): Promise<Channel[] | any> {
    const res = await this.neo4jService.write(
      `
			MATCH (c:Channel {id: $properties.channelId, deleted: false})
			SET c.deleted = true, c.channelTargetId = $properties.targetChannelId
			RETURN c
			`,
      {
        properties,
      },
    );
		return res.records.length ? res.records.map((row) => new Channel(row.get('c'))) : false;
  } 
}
