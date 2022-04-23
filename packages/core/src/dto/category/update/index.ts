import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {

	@ApiProperty({
		required: true,
		description: 'The uuid of the category',
		example: '12345678-1234-1234-1234-1234567890ab',
	})
	categoryId: string;

	@ApiProperty({
		required: true,
		description: 'The name of the category',
		example: 'Special Products',
	})
	name: string;

	@ApiProperty({
		required: true,
		description: 'The description of the category',
		example: 'Products that are special',
	})
	description: string;

	@ApiProperty({
		required: false,
		description: 'SEO title',
		example: 'Special Products',
	})
	seoTitle: string;

	@ApiProperty({
		required: false,
		description: 'SEO description',
		example: 'Products that are special',
	})
	seoDescription: string;

	@ApiProperty({
		required: false,
		description: 'SEO keywords',
		example: 'Special Products',
	})
	seoKeywords: string;

	@ApiProperty({
		required: false,
		description: 'Image URL',
		example: 'https://example.com/image.png',
	})
	imageUrl: string;

}
