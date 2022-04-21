import { ApiProperty } from '@nestjs/swagger';

export class UpdateChannelDto {

	@ApiProperty()
	channelId: string;
	
	@ApiProperty({
		required: true,
		description: 'The name of the category',
		example: 'Special Products',
	})
	name: string;


}