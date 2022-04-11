import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { Neo4jModule } from 'nest-neo4j/dist';
import { AppController } from './controller/app.controller';
import { HealthController } from './controller/health';
import { DatabaseHealthIndicator } from './controller/health/indicator/db';
import { LoggerMiddleware } from './middleware/logger';
import { AppService } from './service/app.service';

@Module({
  imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		Neo4jModule.fromEnv(),
		TerminusModule,
	],
  controllers: [AppController, HealthController],
  providers: [AppService, DatabaseHealthIndicator],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
