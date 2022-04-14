import { NestFactory } from '@nestjs/core';
import supertokens from 'supertokens-node';
import { Neo4jErrorFilter } from 'nest-neo4j/dist';
import { UnprocessibleEntityValidationPipe } from './pipes/unprocessible-entity-validation.pipe';
import { SupertokensExceptionFilter } from './filter/auth'
import { ConfigService } from '@nestjs/config';
import { DefaultLogger } from './config/logger/default';
import { Logger } from './config/logger/graphcommerce';

export async function bootstrap() {
	Logger.useLogger(Logger);
  Logger.info(`Bootstrapping Graph Commerce Core Server (pid: ${process.pid})...`);

	const AppModule = await import('./module/app');
	DefaultLogger.hideNestBoostrapLogs();
  const app = await NestFactory.create(AppModule);
	DefaultLogger.restoreOriginalLogLevel();
  app.useLogger(new Logger());
	
	const configService = app.get(ConfigService);
	
	app.enableCors({
    origin: [configService.get('AUTH_WEBSITE_DOMAIN')],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

	app.useGlobalFilters(new SupertokensExceptionFilter());
	app.useGlobalFilters(new Neo4jErrorFilter());
	app.useGlobalPipes(new UnprocessibleEntityValidationPipe());

  await app.listen(8000);
	Logger.info('Graph Commerce Core Server is listening on port 8000');

	return app;
}
