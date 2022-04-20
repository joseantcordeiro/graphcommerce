import { Module } from '@nestjs/common';
import { CurrenciesService } from '../../service/currencies';
import { CurrenciesController } from '../../controller/currencies';

@Module({
  providers: [CurrenciesService],
  controllers: [CurrenciesController]
})
export class CurrenciesModule {}
