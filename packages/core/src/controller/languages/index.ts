import { CacheInterceptor, CacheTTL, Controller, Get, UseInterceptors } from '@nestjs/common';
import { LanguagesService } from '../../service/languages';

@Controller('languages')
@UseInterceptors(CacheInterceptor)
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}
	@CacheTTL(86400)

  @Get()
  async getList() {
    const languages = await this.languagesService.list();

    return {
      languages: languages.map((language) => language.toJson()),
    };
  }
}