import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import * as redisStore from 'cache-manager-redis-store';
import { Neo4jModule } from 'nest-neo4j/dist';
import { HealthController } from '../../controller/health';
import { DatabaseHealthIndicator } from '../../controller/health/indicator/db';
import { LoggerMiddleware } from '../../middleware/logger';
import { AuthModule } from '../auth';
import { ImageUploadModule } from '../image-upload';
import { PersonModule } from '../person';
import { OrganizationModule } from '../organization';
import { TeamModule } from '../team';
import { CountriesModule } from '../countries';
import { CurrenciesModule } from '../currencies';
import { LanguagesModule } from '../languages';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { BullModule } from '@nestjs/bull';
import { MetadataModule } from '../metadata';

@Module({
  imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transports: [
          new winston.transports.File({
            filename: `${process.cwd()}/${configService.get('LOG_PATH')}`,
          }),
          new winston.transports.Console({
            format: winston.format.combine(
							winston.format.colorize(),
              winston.format.timestamp(),
							winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('GraphCommerceSwagger', { prettyPrint: true }),
            ),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				redis: {
					host: configService.get('QUEUE_HOST'),
					port: +configService.get('QUEUE_PORT'),
					password: configService.get('QUEUE_PASSWORD'),
				},
			}),
			inject: [ConfigService],
		}),
		CacheModule.registerAsync({
			isGlobal: true,
			useFactory: async (configService: ConfigService) => ({
					store: redisStore,
					host: configService.get('REDIS_HOST'),
					port: configService.get('REDIS_PORT'),
					password: configService.get('REDIS_PASSWORD'),
					db: configService.get('REDIS_DB'),
					// ttl: +configService.get('CACHE_TTL'),
					// max: +configService.get('MAX_ITEM_IN_CACHE')
			}),
			inject: [ConfigService],
		}),
		Neo4jModule.fromEnv(),
		AuthModule.fromEnv(),
		TerminusModule,
		ImageUploadModule,
		MetadataModule,
		CountriesModule,
		CurrenciesModule,
		LanguagesModule,
		PersonModule,
		OrganizationModule,
		TeamModule,
	],
  controllers: [HealthController],
  providers: [DatabaseHealthIndicator],
})
export class SwaggerAppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

	/** 
	async onApplicationShutdown(signal?: string) {
		if (signal) {
			Logger.info('Received shutdown signal:' + signal);
		}
	} */
}
