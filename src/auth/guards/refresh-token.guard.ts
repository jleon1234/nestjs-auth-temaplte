import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { IAuthReq } from 'src/shared/interfaces/auth-req';
import { ITokenPayload } from 'src/shared/interfaces/token-payload';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest() as IAuthReq;
      const refreshToken = request.cookies['hid'];

      if (!refreshToken) {
        throw new UnauthorizedException('no-refresh-token-sent');
      }

      const payload = verify(
        refreshToken,
        this.configService.get('REFRESH_TOKEN_SECRET'),
      ) as ITokenPayload;

      if (!payload.sub) {
        throw new UnauthorizedException('invalid-refresh-token');
      }

      const foundUser = await this.userService.findByIdOrFail(payload.sub);

      if (foundUser.tokenVersion !== payload.version) {
        throw new UnauthorizedException('invalid-refresh-token');
      }

      request.user = foundUser;

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
