import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PersonCreatedEvent } from '../../../event/person/created';

@Injectable()
export class PersonCreatedListener {
  @OnEvent('person.created')
  handlePersonCreatedEvent(event: PersonCreatedEvent) {
    // handle and process "PersonCreatedEvent" event
    console.log(event);
  }
}
