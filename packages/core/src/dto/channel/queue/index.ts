export class CreateChannelProcessDto {

	channelId?: string;
	organizationId: string;
	name: string;
	active: boolean = true;
	currencyCode: string;
	defaultCountry: string;

}