import {
  Module,
  DynamicModule,
	Provider,
	Global
} from '@nestjs/common';
import { MEILI_CLIENT, MEILI_MODULE_OPTIONS } from '../../config/search';
import { createConnectionFactory, createAsyncProviders } from '../../provider/search';
import { SearchService } from '../../service/search';
import { ConfigService } from '@nestjs/config';
import MeiliSearch from 'meilisearch';
import { MeiliModuleAsyncOptions, MeiliModuleOptions } from '../../interface/search';

@Global()
@Module({
	imports: [],
  providers: [SearchService],
  exports: [],
  controllers: [],
})
export class SearchModule {

	createConnectionFactory(options: MeiliModuleOptions) {
		return new MeiliSearch(options);
	}

  public static forRoot(options: MeiliModuleOptions): DynamicModule {
    const meiliOptions: Provider = {
      provide: MEILI_MODULE_OPTIONS,
      useValue: options,
    };

    const connectionProvider: Provider = {
      provide: MEILI_CLIENT,
      useFactory: async () =>
        createConnectionFactory({
          host: 'http://127.0.0.1:7700',
          apiKey: '12131211',
        }),
    };
    return {
      module: SearchModule,
      providers: [meiliOptions, connectionProvider, SearchService],
      exports: [connectionProvider, SearchService],
    };
  }

  public static forRootAsync(options: MeiliModuleAsyncOptions): DynamicModule {
    const connectionProvider: Provider = {
      provide: MEILI_CLIENT,
      useFactory: async (meiliOptions: MeiliModuleOptions) =>
        createConnectionFactory(meiliOptions),
      inject: [MEILI_MODULE_OPTIONS],
    };

    const asyncProviders = createAsyncProviders(options);

    return {
      module: SearchModule,
      imports: options.imports || [],
      providers: [...asyncProviders, connectionProvider, SearchService],
      exports: [connectionProvider, SearchService],
    };
  }

	static fromEnv(): DynamicModule {
		const config = new ConfigService()

		const host = config.get<string>('SEARCH_HOST');
		const apiKey = config.get<string>('SEARCH_KEY');
		return {
			providers: [
        {
          useValue: {
            host,
            apiKey,
          },
          provide: MEILI_CLIENT,
        },
      ],
      exports: [],
      imports: [],
      module: SearchModule,
		}
	}
}
