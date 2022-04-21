import { Injectable } from '@nestjs/common';
import { Language } from '../../entity/language';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class LanguagesService {
  constructor(private readonly neo4jService: Neo4jService) {}

  list(): Promise<Language[]> {
    return this.neo4jService
      .read(`MATCH (l:Language { active: true }) RETURN l`)
      .then((res) => res.records.map((row) => new Language(row.get('l'))));
  }
}