import { Provider, Type } from '@nestjs/common';
import { MeiliSearch, Config } from 'meilisearch';
import { MEILI_MODULE_OPTIONS } from '../../config/search';
import {
  MeiliModuleAsyncOptions,
  MeiliModuleOptions,
  MeiliModuleOptionsFactory,
} from '../../interface/search';

export function createConnectionFactory(options: MeiliModuleOptions) {
  return new MeiliSearch(options);
}

export function createAsyncProviders(
  options: MeiliModuleAsyncOptions,
): Provider[] {
  if (options.useExisting || options.useFactory) {
    return [createAsyncOptionsProvider(options)];
  }
  const useClass = options.useClass ;
  return [
    createAsyncOptionsProvider(options),
    {
      provide: useClass,
      useClass,
    },
  ];
}

export function createAsyncOptionsProvider(
  options: MeiliModuleAsyncOptions,
): Provider {
  if (options.useFactory) {
    return {
      provide: MEILI_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
  return {
    provide: MEILI_MODULE_OPTIONS,
    useFactory: async (optionsFactory: MeiliModuleOptionsFactory) =>
      optionsFactory.createMeiliOptions(),
    inject: [
      (options.useClass ||
        options.useExisting),
    ],
  };
}
