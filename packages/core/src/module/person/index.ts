import { Module } from '@nestjs/common';
import { PersonService } from '../../service/person';
import { PersonController } from '../../controller/person';

@Module({
  providers: [PersonService],
  controllers: [PersonController]
})
export class PersonModule {}
