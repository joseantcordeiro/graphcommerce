import { NestFactory } from '@nestjs/core';
import supertokens from 'supertokens-node';
import { AppModule } from './module/app';
import { WorkerModule } from './module/worker'
import { SwaggerAppModule } from './module/swagger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Neo4jErrorFilter } from 'nest-neo4j/dist';
import { UnprocessibleEntityValidationPipe } from './pipes/unprocessible-entity-validation.pipe';
import { SupertokensExceptionFilter } from './filter/auth'
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GlobalExceptionFilter } from './exception/GlobalExceptionFilter';
import { RequestMethod, VersioningType } from '@nestjs/common';

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

	app.enableVersioning({
		type: VersioningType.URI,
	});

	app.setGlobalPrefix('api/v1', {
		exclude: [{ path: 'health', method: RequestMethod.GET }], // replace your endpoints in the place of health!
	});
	
	app.useGlobalFilters(new SupertokensExceptionFilter());
	app.useGlobalFilters(new Neo4jErrorFilter());
	// app.useGlobalPipes(new UnprocessibleEntityValidationPipe());

  await app.listen(8000);

	return app;
}

export async function bootstrapWorker() {

  const app = await NestFactory.create(WorkerModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

	/** for development or debugging */
	const sendInternalServerErrorCause = true;
	const logAllErrors = true;
	app.useGlobalFilters(new GlobalExceptionFilter(sendInternalServerErrorCause, logAllErrors));

  await app.listen(8010);

	return app;
}

export async function bootstrapSwagger() {

  const app = await NestFactory.create(SwaggerAppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

	/** for development or debugging */
	const sendInternalServerErrorCause = true;
	const logAllErrors = true;
	app.useGlobalFilters(new GlobalExceptionFilter(sendInternalServerErrorCause, logAllErrors));

	const config = new DocumentBuilder()
    .setTitle('Graph Commerce API')
    .setDescription('The Graph Commerce API description')
    .setVersion('0.0.1')
    .addTag('graphcommerce')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8020);

	return app;
}
