import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { FindPersonDto } from '../../dto/organization/find';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('person')
@UseInterceptors(CacheInterceptor)
export class PersonController {
  constructor(private readonly personService: PersonService,
		@InjectQueue('mail') private readonly mailQueue: Queue,
		@InjectQueue('person') private readonly personQueue: Queue) {}

  @UseGuards(AuthGuard)
  @Post()
  async postPerson(
    @Session() session: SessionContainer,
    @Body() properties: CreatePersonDto,
  ) {
    const userId = session.getUserId();
		if (userId === properties.userId) {
			const person = await this.personService.create(properties);
			if (Array.isArray(person)) {
				this.personQueue.add('create', {
					person,
				});
				this.mailQueue.add('welcome', {
					email: person[0].getEmail(),
					name: person[0].getName(),
				});
				return {
					persons: person.map(m => m.toJson()),
				};
			}
		}
		throw new HttpException('Person couldn\'t be created', HttpStatus.NOT_MODIFIED);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getPerson(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    const person = await this.personService.get(userId);
		if (Array.isArray(person)) {
			return {
				persons: person.map(m => m.toJson()),
			};
		}
		throw new HttpException('Something is wrong, try to refresh the session.', HttpStatus.NOT_FOUND);
  }

	@UseGuards(AuthGuard)
	@Get('find')
	async findPerson(@Body() properties: FindPersonDto) {
		const person = await this.personService.find(properties);
		if (Array.isArray(person)) {
			return {
				persons: person.map(m => m.toJson()),
			};
		}
		throw new HttpException('Person not found in current organization', HttpStatus.NOT_FOUND);
	}

  @UseGuards(AuthGuard)
  @Patch()
  async patchPerson(
    @Session() session: SessionContainer,
    @Body() properties: UpdatePersonDto,
  ) {
    const userId = session.getUserId();
    if (userId === properties.userId) {
    	const person = await this.personService.update(properties);
			if (Array.isArray(person)) {
				this.personQueue.add('update', {
					userId: userId, person: person,
				});
				return {
					persons: person.map(m => m.toJson()),
				};
			}
			throw new HttpException('Person couldn\'t be updated', HttpStatus.NOT_MODIFIED);
    }
		throw new HttpException('You need to have the MANAGE_ORGANIZATION role', HttpStatus.FORBIDDEN);
  }

	@UseGuards(AuthGuard)
	@Post('organization')
	async makeDefaultOrganization(@Session() session: SessionContainer,
		@Body() properties: {organizationId: string}) {
		const userId = session.getUserId();
		const defaultOrganization = await this.personService.makeDefaultOrganization(userId, properties.organizationId);
		if (Array.isArray(defaultOrganization)) {
			this.personQueue.add('organizationdefault', {
				userId: userId, organization: defaultOrganization,
			});
			return {
				defaultOrganization: defaultOrganization.map(m => m.toJson()),
			};
		}
		throw new HttpException('Something is wrong, try to refresh the session.', HttpStatus.NOT_FOUND);
	}

	@UseGuards(AuthGuard)
	@Get('organization')
	async getOrganization(@Session() session: SessionContainer) {
		const userId = session.getUserId();
		const defaultOrganization = await this.personService.organization(userId);
		if (Array.isArray(defaultOrganization)) {
			return {
				defaultOrganization: defaultOrganization.map(m => m.toJson()),
			};
		}
		throw new HttpException('Something is wrong, try to refresh the session.', HttpStatus.NOT_FOUND);
	}

  @UseGuards(AuthGuard)
  @Delete()
  async deletePerson(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    const deleted = await this.personService.delete(userId);
		this.personQueue.add('update', {
			userId: userId, person: deleted,
		});
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
