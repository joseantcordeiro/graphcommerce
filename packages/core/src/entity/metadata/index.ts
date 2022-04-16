import { ApiProperty } from "@nestjs/swagger"

export class Metadata {

	@ApiProperty()
  key: string;

	@ApiProperty()
  value: string;
	
}