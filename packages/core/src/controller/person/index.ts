import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { CreatePersonDto } from '../../dto/person/create';
import { UpdatePersonDto } from '../../dto/person/update';
import { PersonService } from '../../service/person';
import { Session } from '../../decorator/session';
import { AuthGuard } from '../../guard/auth';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '../../entity/file';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @UseGuards(AuthGuard)
  @Post()
  async postPerson(
    @Session() session: SessionContainer,
    @Body() properties: CreatePersonDto,
  ) {
    const userId = session.getUserId();
		if (userId === properties.userId) {
			return this.personService.create(properties);
		} else {
			return this.personService.createStaff(properties);
		}
  }

  @UseGuards(AuthGuard)
  @Get()
  async getPerson(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    return this.personService.get(userId);
  }

	@UseGuards(AuthGuard)
	@Get('find')
	async findPerson(@Body() body: { email: string }) {
		return this.personService.find(body.email);
	}

  @UseGuards(AuthGuard)
  @Patch()
  async patchPerson(
    @Session() session: SessionContainer,
    @Body() properties: UpdatePersonDto,
  ) {
    const userId = session.getUserId();
    if (userId === properties.userId) {
    	return this.personService.update(properties);
    } else {
			return { message: 'Not allowed' };
    }
  }

  @UseGuards(AuthGuard)
  @Delete()
  async deletePerson(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    const deleted = await this.personService.delete(userId);
    return {
      ...deleted.toJson(),
    };
  }

	@UseGuards(AuthGuard)
	@Post('picture')
	@UseInterceptors(FileInterceptor('image'))
	async uploadAvatar(@Session() session: SessionContainer, @UploadedFile() image: BufferedFile) {
		return this.personService.uploadPicture(session.getUserId(), image);
	}
}
