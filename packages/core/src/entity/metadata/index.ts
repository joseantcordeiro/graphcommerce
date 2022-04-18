import { Node } from "neo4j-driver";

export class Metadata {
  constructor(private readonly node: Node) {}

	toJson() {
    return {
      ...this.node.properties,
    };
  }
}