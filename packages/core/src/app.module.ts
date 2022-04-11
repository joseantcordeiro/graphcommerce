import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { Neo4jModule } from 'nest-neo4j/dist';
import { AppController } from './controller/app.controller';
import { HealthController } from './controller/health';
import { DatabaseHealthIndicator } from './controller/health/indicator/db';
import { LoggerMiddleware } from './middleware/logger';
import { AuthModule } from './module/auth';
import { AuthController } from './controller/auth'
import { AuthService } from './service/auth'
import { AppService } from './service/app.service';

@Module({
  imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		Neo4jModule.fromEnv(),
		AuthModule.forRoot({
      connectionURI: 'http://192.168.1.81:3567/tokens',
      apiKey:
        'sjnNfRVaBPXbYwJ00jAbE280K5wWR8byekTdx7mRgxZSv430qwiE5Poh2bCKeyjD',
      appInfo: {
        appName: 'Graph Commerce',
        apiDomain: 'http://localhost:8000',
        websiteDomain: 'http://localhost:3000',
      },
    }),
		TerminusModule,
	],
  controllers: [AppController, HealthController, AuthController],
  providers: [AppService, DatabaseHealthIndicator, AuthService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
