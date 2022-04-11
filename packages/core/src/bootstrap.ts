import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import supertokens from 'supertokens-node';
import { Neo4jErrorFilter } from 'nest-neo4j/dist';
import { UnprocessibleEntityValidationPipe } from './pipes/unprocessible-entity-validation.pipe';
import { SupertokensExceptionFilter } from './filter/auth'

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

	app.enableCors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

	app.useGlobalFilters(new SupertokensExceptionFilter());
	app.useGlobalFilters(new Neo4jErrorFilter());
	app.useGlobalPipes(new UnprocessibleEntityValidationPipe());

  await app.listen(8000);
}