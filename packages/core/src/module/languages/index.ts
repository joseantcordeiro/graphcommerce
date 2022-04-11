import { Module } from '@nestjs/common';
import { LanguagesService } from '../../service/languages';
import { LanguagesController } from '../../controller/languages';

@Module({
  providers: [LanguagesService],
  controllers: [LanguagesController]
})
export class LanguagesModule {}