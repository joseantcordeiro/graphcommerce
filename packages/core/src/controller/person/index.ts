import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePersonDto } from '../../dto/person/create';
import { UpdatePersonDto } from '../../dto/person/update';
import { PersonService } from '../../service/person';
import { Session } from '../../decorator/session';
import { AuthGuard } from '../../guard/auth';
import { SessionContainer } from 'supertokens-node/recipe/session';

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
    // TODO: Validate if user have correct role to create staff
    const created = await this.personService.create(properties);
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
    // TODO: add validation
    //if (userId === properties.userId) {
    const updated = await this.personService.update(properties);
    //} else {
    //  const uptated = await this.personService.updateStaff(userId, properties);
    //}
    return {
      ...updated.toJson(),
    };
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
}
