import { ApiProperty } from '@nestjs/swagger';

export class UpdateMetadataDto {
  @ApiProperty({ 
		required: true,
		description: 'The object ID (uuid) of the object to which the metadata belongs',
		example: '12345678-1234-1234-1234-1234567890ab',
	})
  objectId: string;

  @ApiProperty({
		required: true,
		description: 'The key of the metadata',
		example: 'SPECIAL_PRODUCT',
	})
  key: string;

  @ApiProperty({
		required: true,
		description: 'The value of the metadata',
		example: 'true',
	})
  value: string;

	@ApiProperty({
		required: false,
		description: 'If true is protected and visible only to staff users, plugins, and Apps with appropriate permissions'
	})
	private: boolean = false;
}