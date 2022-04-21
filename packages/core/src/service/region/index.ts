import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Region } from '../../entity/region';
import { Country } from '../../entity/country';
import { CreateRegionDto } from '../../dto/region/create';
import { Node, Integer } from 'neo4j-driver';

@Injectable()
export class RegionService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findById(regionId: string): Promise<Region | undefined> {
    const res = await this.neo4jService.read(
      `
	  MATCH (r:Region {id: $regionId})
	  RETURN r,
	    	 [ (c:Country)-[:BELONGS_TO]->(r) | c ] AS countries
	  `,
      { regionId },
    );
    return new Region(
      res.records[0].get('r'),
      res.records[0]
        .get('countries')
        .map((u: Node<Integer, { [key: string]: any }>) => new Country(u)),
    );
  }

  async create(region: CreateRegionDto): Promise<Region | undefined> {
    return this.neo4jService
      .write(
        `
		CREATE (r:Region { id: randomUUID(), name: $properties.name })
		WITH r
		MATCH (c:Country) WHERE c.iso_2 IN $properties.countries
		MERGE (c)-[:BELONGS_TO]->(r)
		RETURN r, c
		`,
        {
          properties: {
            ...region,
          },
        },
      )
      .then(
        (res) =>
          new Region(res.records[0].get('r'), [
            new Country(res.records[0].get('c')),
          ]),
      ); // TODO: return the created region with all countries not working
  }
}
