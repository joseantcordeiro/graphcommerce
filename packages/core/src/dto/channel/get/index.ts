import { ApiProperty } from '@nestjs/swagger';

export class GetChannelDto {

	@ApiProperty({
		required: true,
		description: 'The uuid of the channel',
		example: '12345678-1234-1234-1234-1234567890ab',
	})
	channelId: string;

}