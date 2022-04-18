import { ApiProperty } from '@nestjs/swagger';

export class GetMetadataDto {
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

}