import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {

	@ApiProperty({
		required: true,
		description: 'Organization uuid',
		example: '5e9f8f8f-f8f8-f8f8-f8f8-f8f8f8f8f8f8',
	})
	organizationId: string;

	@ApiProperty({
		required: true,
		description: 'The name of the category',
		example: 'Special Products',
	})
	name: string;

	@ApiProperty({
		required: true,
		description: 'True if the channel is active',
		example: true,
	})
	active: boolean = true;

	@ApiProperty({
		required: true,
		description: 'Currency code',
		example: 'usd',
	})
	currencyCode: string;

	@ApiProperty({
		required: true,
		description: 'Default country code',
		example: 'us',
	})
	defaultCountry: string;

}