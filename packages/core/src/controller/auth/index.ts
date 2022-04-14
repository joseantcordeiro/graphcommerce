import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthService } from '../../service/auth';
import { AuthGuard } from '../../guard/auth';
import { Session } from '../../decorator/session';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

  @Get('sessioninfo')
  @UseGuards(AuthGuard)
  getSessionInfo(@Session() session: SessionContainer): any {
    return this.authService.getSessionInfo(session);
  }
}
