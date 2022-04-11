import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from '../../service/currencies';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  async getList() {
    const currencies = await this.currenciesService.list();

    return {
      currencies: currencies.map((currency) => currency.toJson()),
    };
  }
}
