import { Controller, Get } from '@nestjs/common';
import { LanguagesService } from '../../service/languages';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  async getList() {
    const languages = await this.languagesService.list();

    return {
      languages: languages.map((language) => language.toJson()),
    };
  }
}