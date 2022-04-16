import { ApiProperty } from '@nestjs/swagger';

export class FindPersonDto {
	
	@ApiProperty({
		description: 'The id of the organization that the person belongs to.',
		required: true,
		type: 'string', })
	organizationId: string;

  @ApiProperty({
		description: 'The email of the person.',
		required: true,
		type: 'string', })
  email: string;

}