import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../enum/role';
/** import { IsNotEmpty } from 'class-validator'; */

export class CreateTeamDto {

	@ApiProperty()
	organizationId: string;

	@ApiProperty({
		description: 'The name of a Team',
		minimum: 3,
		default: 'Dream Team',
	})
  name: string;

	@ApiProperty({ required: false, default: true })
  isEnabled?: boolean = true;

}
