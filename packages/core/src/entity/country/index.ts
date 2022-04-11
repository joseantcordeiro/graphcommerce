import { Node } from 'neo4j-driver';

export class Country {
  constructor(private readonly node: Node) {}

  toJson() {
    return {
      ...this.node.properties,
    };
  }
}
