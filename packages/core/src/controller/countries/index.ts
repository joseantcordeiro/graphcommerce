import { CacheInterceptor, CacheTTL, Controller, Get, UseInterceptors } from '@nestjs/common';
import { CountriesService } from '../../service/countries';

@Controller('countries')
@UseInterceptors(CacheInterceptor)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @CacheTTL(86400)
  @Get()
  async getList() {
    const countries = await this.countriesService.list();

    return {
      countries: countries.map((country) => country.toJson()),
    };
  }
}
