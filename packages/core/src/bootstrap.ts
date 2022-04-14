import { NestFactory } from '@nestjs/core';
import supertokens from 'supertokens-node';
import { AppModule } from './module/app';
import { Neo4jErrorFilter } from 'nest-neo4j/dist';
import { UnprocessibleEntityValidationPipe } from './pipes/unprocessible-entity-validation.pipe';
import { SupertokensExceptionFilter } from './filter/auth'
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GlobalExceptionFilter } from './exception/GlobalExceptionFilter';

export async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
	
	const configService = app.get(ConfigService);
	
	app.enableCors({
    origin: [configService.get('AUTH_WEBSITE_DOMAIN')],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

	/** for development or debugging */
	const sendInternalServerErrorCause = true;
	const logAllErrors = true;
	app.useGlobalFilters(new GlobalExceptionFilter(sendInternalServerErrorCause, logAllErrors));

	app.useGlobalFilters(new SupertokensExceptionFilter());
	app.useGlobalFilters(new Neo4jErrorFilter());
	app.useGlobalPipes(new UnprocessibleEntityValidationPipe());

  await app.listen(8000);

	return app;
}
