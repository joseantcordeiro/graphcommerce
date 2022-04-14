import { MiddlewareConsumer, Module, NestModule, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { Neo4jModule } from 'nest-neo4j/dist';
import { HealthController } from '../../controller/health';
import { DatabaseHealthIndicator } from '../../controller/health/indicator/db';
import { LoggerMiddleware } from '../../middleware/logger';
import { AuthModule } from '../auth';
import { ImageUploadModule } from '../image-upload';
import { PersonModule } from '../person';
import { OrganizationModule } from '../organization';
import { CountriesModule } from '../countries';
import { CurrenciesModule } from '../currencies';
import { LanguagesModule } from '../languages';
import { Logger } from '../../config/logger/graphcommerce';

@Module({
  imports: [
		ConfigModule.forRoot({ isGlobal: true }),
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
export class AppModule implements NestModule, OnApplicationShutdown {
	configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

	async onApplicationShutdown(signal?: string) {
		if (signal) {
			Logger.info('Received shutdown signal:' + signal);
		}
	}
}
