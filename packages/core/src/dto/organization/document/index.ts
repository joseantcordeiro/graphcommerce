import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDocumentDto {
	constructor(
		public id: string,
		public name: string,
	) {}

	getId(): string {
		return this.id;
	}

	getName(): string {
		return this.name;
	}

}