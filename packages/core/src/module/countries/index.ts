import { Module } from '@nestjs/common';
import { CountriesService } from '../../service/countries';
import { CountriesController } from '../../controller/countries';

@Module({
  providers: [CountriesService],
  controllers: [CountriesController]
})
export class CountriesModule {}
