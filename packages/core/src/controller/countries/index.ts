import { Controller, Get } from '@nestjs/common';
import { CountriesService } from '../../service/countries';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getList() {
    const countries = await this.countriesService.list();

    return {
      countries: countries.map((country) => country.toJson()),
    };
  }
}
