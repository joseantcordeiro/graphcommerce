import { ApiProperty } from '@nestjs/swagger';

import { GroupType } from '../../../enum/group';
export class CreateGroupDto {

	@ApiProperty({
		required: true,
		description: 'The uuid of the organization',
		example: '12345678-1234-1234-1234-1234567890ab',
	})
	organizationId: string;

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

	@ApiProperty({
		required: false,
		description: 'The type of the group',
		example: GroupType.PERMISSION,
	})
	type: GroupType = GroupType.PERMISSION;

}
