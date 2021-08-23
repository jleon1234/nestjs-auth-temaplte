import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { Response } from 'express';
import { IAuthReq } from 'src/shared/interfaces/auth-req';
import { UserService } from 'src/user/services/user.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async login(req: IAuthReq, res: Response) {
    const accessToken = this.tokenService.getAccessToken(req.user);
    const refreshToken = this.tokenService.getRefreshToken(req.user);

    res.cookie('hid', refreshToken, { httpOnly: true });

    await this.userService.updateRefreshToken(req.user.id, refreshToken);

    const updatedUser = await this.userService.logSignIn(req.user.id);

    return {
      accessToken,
      user: updatedUser.toJSON(),
    };
  }

  async revoke(request: IAuthReq, response: Response) {
    request.user.tokenVersion += 1;
    request.user.refreshToken = '';
    response.clearCookie('hid');
    await request.user.save();
    return true;
  }

  async logout(req: IAuthReq, res: Response) {
    req.user.refreshToken = '';
    await req.user.save();
    res.clearCookie('hid');
    return true;
  }

  async getForgotPasswordHash(userEmail: string) {
    const foundUser = await this.userService.findByEmailOrFail(userEmail);

    const updatedUser = await this.userService.updateRecoverPasswordHash(
      foundUser.id,
    );

    await this.notificationService.sendForgotPassword(updatedUser);

    return {
      email: updatedUser.email,
      recoverHash: updatedUser.recoverPasswordHash,
    };
  }

  async restorePassword(userId: string, password: string) {
    const foundUser = await this.userService.findByIdOrFail(userId);
    foundUser.password = await hash(password, await genSalt());
    const updatedUser = await foundUser.save();
    return updatedUser;
  }
}
