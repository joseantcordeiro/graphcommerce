import { Node } from 'neo4j-driver';
import { Person } from '../person';

export class Team {
  constructor(private readonly node: Node,
							private readonly members: Person[]) {}

  getId() {
    return this.node.properties.id;
  }

  getName() {
    return this.node.properties.name;
  }

	getIsEnabled() {
		return this.node.properties.isEnabled;
	}

  toJson() {
    return {
      ...this.node.properties,
    };
  }

	withMembers() {
		return { 
			...this.node.properties,
			members: this.members.map(m => m.toJson()),
		};
	}
}