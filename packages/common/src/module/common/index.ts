import { Module } from '@nestjs/common';
import { CountriesController } from '../../controller/countries';
import { CurrenciesController } from '../../controller/currencies';
// import { RegionController } from './region/region.controller';
import { LanguagesController } from '../../controller/languages';
import { CountriesService } from '../../service/countries';
import { CurrenciesService } from '../../service/currencies';
// import { RegionService } from '../../service/region/region.service';
import { LanguagesService } from '../../service/languages';

@Module({
  providers: [CountriesService, CurrenciesService, LanguagesService],
  controllers: [
    CountriesController,
    CurrenciesController,
    // RegionController,
    LanguagesController,
  ],
  exports: [],
})
export class CommonModule {}