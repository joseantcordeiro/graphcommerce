import { ApiProperty } from '@nestjs/swagger';

export class DeleteChannelDto {

	@ApiProperty({
		required: true,
		description: 'The uuid of the channel',
		example: '12345678-1234-1234-1234-1234567890ab',
	})
	channelId: string;

	@ApiProperty({
		required: false,
		description: 'If there are existing orders, they will be moved into this channel',
		example: '12345678-1234-1234-1234-1234567890ab',
	})
	targetChannelId: string;

}