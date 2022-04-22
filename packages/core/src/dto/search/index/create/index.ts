import { ApiProperty } from '@nestjs/swagger';

export class CreateIndexDto {

	@ApiProperty({
		required: true,
		description: 'The index unique identifier (mandatory)',
		example: 'special-products',
	})
	uid: string;

	@ApiProperty({
		required: false,
		description: 'The primary key of the documents',
		example: '{ "primaryKey": "id" }',
	})
	primaryKey: string;

}