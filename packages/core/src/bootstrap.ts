import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Neo4jErrorFilter } from 'nest-neo4j/dist';
import { UnprocessibleEntityValidationPipe } from './pipes/unprocessible-entity-validation.pipe';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

	app.useGlobalFilters(new Neo4jErrorFilter());
	app.useGlobalPipes(new UnprocessibleEntityValidationPipe());

  await app.listen(8000);
}