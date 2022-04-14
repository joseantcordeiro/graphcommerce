import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j/dist';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { BullModule } from '@nestjs/bull';
import { PictureModule } from '../picture'

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
              nestWinstonModuleUtilities.format.nestLike('GraphCommerceWorker', { prettyPrint: true }),
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
		Neo4jModule.fromEnv(),
		PictureModule,
	],
  controllers: [],
  providers: [],
})
export class WorkerModule {
	/** 
	async onApplicationShutdown(signal?: string) {
		if (signal) {
			Logger.info('Received shutdown signal:' + signal);
		}
	} */
}
