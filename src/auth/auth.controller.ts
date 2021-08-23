import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Request,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { IAuthReq } from 'src/shared/interfaces/auth-req';
import { EmailPipe } from 'src/shared/pipes/email.pipe';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { BasicAuthGuard } from './guards/basic-auth.guard';
import { RecoverPasswordGuard } from './guards/recover-password.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(BasicAuthGuard)
  async login(@Request() request: IAuthReq, @Res() response: Response) {
    const result = await this.authService.login(request, response);
    return response.json(result);
  }

  @Post('/refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Request() request: IAuthReq, @Res() response: Response) {
    const result = await this.authService.login(request, response);
    return response.json(result);
  }

  @Post('/revoke')
  @UseGuards(AccessTokenGuard)
  async revoke(@Request() request: IAuthReq, @Res() response: Response) {
    const result = await this.authService.revoke(request, response);
    return response.json(result);
  }

  @Post('/forgot')
  async forgotPassword(@Body('email', EmailPipe) email: string) {
    return this.authService.getForgotPasswordHash(email);
  }

  @Patch('/recover')
  @UseGuards(RecoverPasswordGuard)
  async recoverPassword(
    @Body('password') password: string,
    @Body('user') user: string,
  ) {
    return this.authService.restorePassword(user, password);
  }

  @Delete('/logout')
  @UseGuards(AccessTokenGuard)
  async logout(@Request() request: IAuthReq, @Res() response: Response) {
    const result = await this.authService.logout(request, response);
    return response.json(result);
  }
}
