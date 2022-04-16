import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';

import { CreateTeamDto } from '../../dto/team/create';
import { UpdateTeamDto } from '../../dto/team/update';
/** import { AddUserTeamDto } from './dto/addUser-team.dto';
import { RemoveUserTeamDto } from './dto/removeUser-team.dto'; */
import { Team } from '../../entity/team';
import { Person } from '../../entity/person';
// import { Node, Integer } from 'neo4j-driver';

@Injectable()
export class TeamService {
  constructor(private readonly neo4jService: Neo4jService) {}

	async get(userId: string): Promise<Team[] | any> {
		const res = await this.neo4jService.read(
			`
			MATCH (p:Person { id: $userId })-[:IS_MEMBER]->(t:Team)
			RETURN t, p
			`, { userId },
		);
		return res.records.length ? res.records.map((row) => new Team(row.get('t'), [
				new Person(row.get('p')),
			])) : {};
	}

  async getById(teamId: string): Promise<Team[] | any> {
    const res = await this.neo4jService.read(
      `
				MATCH (p:Person)-[:IS_MEMBER]->(t:Team {id: $teamId})
        RETURN t, p
        `,
      { teamId },
    );
    return res.records.length ? res.records.map((row) => new Team(row.get('t'), [
			new Person(row.get('p')),
			])) : {};
  }

	async getUserRoles(userId: string, teamId: string): Promise<string[]> {
		const res = await this.neo4jService.read(
			`
			MATCH (p:Person { id: $userId })-[r:IS_MEMBER]->(t:Team { id: $teamId })
			RETURN r.role
			`,	{ userId, teamId },
		);
		return res.records.length ? res.records[0].get('r.role') : [];
	}

  async create(
    userId: string,
    properties: CreateTeamDto,
  ): Promise<Team[] | any> {
    const res = await this.neo4jService.write(
      `
			MATCH (p:Person { id: $userId }), (o:Organization { id: $properties.organizationId })
			WITH p, o, randomUUID() AS uuid
      CREATE (t:Team { id: uuid })
      SET t.name = $properties.name, t.isEnabled = $properties.isEnabled
			MERGE (t)-[:IS_TEAM { createdAt: datetime() }]->(o)
			MERGE (p)-[:IS_MEMBER { role: ['MANAGE_TEAM'], since: datetime() }]->(t)
      RETURN t, p
      `,
      {
        userId,
        properties,
      },
    );

    return res.records.length ? res.records.map((row) => new Team(row.get('t'), [
			new Person(row.get('p')),
			])) : {};
  }

  async update(
    properties: UpdateTeamDto,
  ): Promise<Team[] | any> {
    const res = await this.neo4jService.write(
      `
            MATCH (t:Team { id: $properties.teamId })
            SET t.name = $properties.name, t.isEnabled = $properties.isEnabled, t.updatedAt = datetime()
            RETURN t,
									 [ (p)-[:IS_MEMBER]->(t) | p ] AS members
        `,
      { properties },
    );
		return res.records.length ? res.records.map((row) => new Team(row.get('t'), [
			new Person(row.get('members')),
			])) : {};
  }

	/** 
  async addUser(
    teamId: string,
    properties: AddUserTeamDto,
  ): Promise<Team | undefined> {
    return this.neo4jService
      .write(
        `
			MATCH (t:Team { id: $teamId }), (u:User { id: $properties.userId })
			MERGE (u)-[:WORKS_AT {roles: $properties.roles}]->(t)
			RETURN t,
				   [ (u)-[:WORKS_AT]->(t) | u ] AS members
		`,
        { teamId, properties },
      )
      .then((res) => {
        if (res.records.length === 0) {
          return undefined;
        }
        return new Team(
          res.records[0].get('t'),
          res.records[0]
            .get('members')
            .map((u: Node<Integer, { [key: string]: any }>) => new User(u)),
        );
      });
  }

  async removeUser(
    teamId,
    properties: RemoveUserTeamDto,
  ): Promise<Team | undefined> {
    return this.neo4jService
      .write(
        `
			MATCH (t:Team { id: $teamId }), (u:User { id: $properties.userId })
			OPTIONAL MATCH (u)-[r:WORKS_AT]->(t)
			DELETE r
			RETURN t,
				   [ (u)-[:WORKS_AT]->(t) | u ] AS members
		`,
        { teamId, properties },
      )
      .then((res) => {
        if (res.records.length === 0) {
          return undefined;
        }
        return new Team(
          res.records[0].get('t'),
          res.records[0]
            .get('members')
            .map((u: Node<Integer, { [key: string]: any }>) => new User(u)),
        );
      });
  } */
}
