import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroupDto {

	@ApiProperty({
		required: true,
		description: 'The uuid of the group',
		example: '12345678-1234-1234-1234-1234567890ab',
	})
	groupId: string;

	@ApiProperty({
		required: true,
		description: 'The name of the group',
		example: 'Marketing',
	})
	name: string;

	@ApiProperty({
		required: true,
		description: 'The description of the group',
		example: 'Organization management',
	})
	description: string;

	@ApiProperty({
		required: false,
		description: 'True if the group is active',
		example: true,
	})
	active: boolean = true;

}