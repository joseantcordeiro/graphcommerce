import { Injectable } from '@nestjs/common';
import { SessionInfoDto } from '../../dto/sessioninfo'

@Injectable()
export class AuthService {
  getHello(): string {
    return 'Hello World!';
  }

	getSessionInfo(session: any): SessionInfoDto {
    return new SessionInfoDto(
      session.getHandle(),
      session.getUserId(),
      session.getAccessTokenPayload(),
    ).toJSON();
  }
}