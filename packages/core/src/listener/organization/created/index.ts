import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrganizationCreatedEvent } from '../../../event/organization/created';

@Injectable()
export class OrganizationCreatedListener {
  @OnEvent('organization.created')
  handleOrganizationCreatedEvent(event: OrganizationCreatedEvent) {
    // handle and process "OrganizationCreatedEvent" event
    console.log(event);
  }
}