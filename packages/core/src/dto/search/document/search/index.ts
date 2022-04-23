import { ApiProperty } from '@nestjs/swagger';

export class SearchDocumentsDto {

	@ApiProperty({
		required: true,
		description: 'Query string (mandatory)',
		example: 'special product',
	})
	q: string;

	@ApiProperty({
		required: false,
		description: 'Number of documents to skip',
		example: '0',
	})
	offset: number = 0;

	@ApiProperty({
		required: false,
		description: 'Maximum number of documents returned',
		example: '10',
	})
	limit: number = 20;

}