import { Node } from 'neo4j-driver';
import { Country } from '../../entity/country';

export class Region {
  constructor(
    private readonly node: Node,
    private readonly countries: Country[],
  ) {}

  getId(): string {
    return (<Record<string, any>>this.node.properties).id;
  }

  toJson(): Record<string, any> {
    return {
      ...this.node.properties,
      countries: this.countries.map((country) => country.toJson()),
    };
  }
}
