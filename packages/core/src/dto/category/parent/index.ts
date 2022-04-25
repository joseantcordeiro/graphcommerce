import { ApiProperty } from '@nestjs/swagger';

export class ParentOfCategoryDto {

	@ApiProperty({
		required: true,
		description: 'The uuid of the parent category',
		example: '12345678-1234-1234-1234-1234567890ab',
	})
	parentId: string;

	@ApiProperty({
		required: true,
		description: 'The uuid of the category',
		example: '12345678-1234-1234-1234-1234567890ab',
	})
	categoryId: string;

}
