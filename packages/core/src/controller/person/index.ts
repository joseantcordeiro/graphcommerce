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
			const created this.personService.create(properties);
		} else {
			const created = await this.personService.createStaff(properties);
		}
    return {
      ...created.toJson(),
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async getPerson(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    const created = await this.personService.get(userId);
    return {
      ...created.toJson(),
    };
  }

  @UseGuards(AuthGuard)
  @Patch()
  async patchPerson(
    @Session() session: SessionContainer,
    @Body() properties: UpdatePersonDto,
  ) {
    const userId = session.getUserId();
    if (userId === properties.userId) {
    	const updated = await this.personService.update(properties);
			return {
				...updated.toJson(),
			};
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
