import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Neo4jModule } from 'nest-neo4j/dist';
import { HealthController } from './controller/health';
import { DatabaseHealthIndicator } from './controller/health/indicator/db';
import { LoggerMiddleware } from './middleware/logger';
import { AuthModule } from './module/auth';
import { ImageUploadModule } from './module/image-upload';
import { PersonModule } from './module/person';
import { OrganizationModule } from './module/organization';
import { CountriesModule } from './module/countries';
import { CurrenciesModule } from './module/currencies';
import { LanguagesModule } from './module/languages';

@Module({
  imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		EventEmitterModule.forRoot(),
		Neo4jModule.fromEnv(),
		AuthModule.fromEnv(),
		TerminusModule,
		ImageUploadModule,
		CountriesModule,
		CurrenciesModule,
		LanguagesModule,
		PersonModule,
		OrganizationModule,
	],
  controllers: [HealthController],
  providers: [DatabaseHealthIndicator],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
