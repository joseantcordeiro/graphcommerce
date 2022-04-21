import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
/** import { CreateChannelDto } from '../../dto/channel/create';
import { UpdateChannelDto } from '../../dto/channel/update';
import { Channel } from '../../entity/channel'; */

@Injectable()
export class ChannelService {
  constructor(private readonly neo4jService: Neo4jService) {}
/**  
  async get(userId: string): Promise<Channel[] | any> {
    const res = await this.neo4jService
      .read(
        `
			  MATCH (c:Channel { id: $channelId })<-[:HAS_CHANNEL]->(o:Organization { id: $organizationId })
			  RETURN c
			  `,
        { userId },
      );
			return res.records.length ? res.records.map((row) => new Channel(row.get('c'))) : false;
  }

	async list(organizationId: string): Promise<Channel[] | any> {
		const res = await this.neo4jService.read(
			`
			MATCH (c:Channel)<-[:HAS_CHANNEL]-(o:Organization { id: $organizationId })
			RETURN c
			`,
			{ organizationId },
		);
		return res.records.length ? res.records.map((row) => new Channel(row.get('c'))) : false;
	}

  async create(
    userId: string,
    properties: CreateChannelDto,
  ): Promise<Channel[] | any> {
    const res = await this.neo4jService.write(
      `
			MATCH (p:Person {id: $userId}), (o:Organization { id: $properties.organizationId}),(a:Currency { code: $properties.defaultCurrency }), (c:Country { iso_2: $properties.defaultCountry })
			WITH p, o, a, c, randomUUID() AS uuid
			CREATE (m:Channel { id: uuid, name: $properties.name, active: $properties.active })
			CREATE (o)-[:HAS_CHANNEL { createdAt: datetime() }]->(m)
			CREATE (m)-[:HAS_DEFAULT_COUNTRY]->(c)
			CREATE (m)-[:HAS_DEFAULT_CURRENCY]->(a)
			RETURN m
	  `,
      {
        userId,
        properties,
      },
    );

		return res.records.length ? res.records.map((row) => new Channel(row.get('o'))) : false;

  }

  async update(
    properties: UpdateChannelDto,
  ): Promise<Channel[] | any> {
    const res = await this.neo4jService.write(
      `
		MATCH (c:Channel {id: $properties.channelId})
		WITH c
		SET c.name = $properties.name
		RETURN c
	  `,
      {
        properties,
      },
    );
    return res.records.length ? res.records.map((row) => new Channel(row.get('o'))) : false;
  }

  async delete(channelId: string): Promise<Channel[] | any> {
    const res = await this.neo4jService.write(
      `
			MATCH (c:Channel {id: $channelId})
			SET c.deleted = true
			RETURN c
			`,
      {
        channelId,
      },
    );
		return res.records.length ? res.records.map((row) => new Channel(row.get('c'))) : false;
  }*/
}
