import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from '@nestjs/common';

import { AuthMiddleware } from '../../middleware/auth';
import { ConfigInjectionToken, AuthModuleConfig } from '../../config/auth';
import { SupertokensService } from '../../service/supertokens';
import { AuthService } from '../../service/auth';
import { AuthController } from '../../controller/auth';
import { ConfigService } from '@nestjs/config';
import { PersonService } from '../../service/person';
import { PersonModule } from '../person';

@Module({
	imports: [],
  providers: [SupertokensService, AuthService],
  exports: [],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot({
    connectionURI,
    apiKey,
    appInfo,
  }: AuthModuleConfig): DynamicModule {
    return {
      providers: [
        {
          useValue: {
            appInfo,
            connectionURI,
            apiKey,
          },
          provide: ConfigInjectionToken,
        },
      ],
      exports: [],
      imports: [],
      module: AuthModule,
    };
  }

	static fromEnv(): DynamicModule {
		const config = new ConfigService()
		const appInfo = {
			appName: config.get<string>('AUTH_APP_NAME'),
			apiDomain: config.get<string>('AUTH_API_DOMAIN'),
			websiteDomain: config.get<string>('AUTH_WEBSITE_DOMAIN')
		}
		const connectionURI = config.get<string>('AUTH_URI');
		const apiKey = config.get<string>('AUTH_API_KEY');
		return {
			providers: [
        {
          useValue: {
            appInfo,
            connectionURI,
            apiKey,
          },
          provide: ConfigInjectionToken,
        },
      ],
      exports: [],
      imports: [],
      module: AuthModule,
		}
	}
}
