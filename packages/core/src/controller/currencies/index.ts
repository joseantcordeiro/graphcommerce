import { CacheInterceptor, CacheTTL, Controller, Get, UseInterceptors } from '@nestjs/common';
import { CurrenciesService } from '../../service/currencies';

@Controller('currencies')
@UseInterceptors(CacheInterceptor)
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}
	@CacheTTL(86400)

  @Get()
  async getList() {
    const currencies = await this.currenciesService.list();

    return {
      currencies: currencies.map((currency) => currency.toJson()),
    };
  }
}
