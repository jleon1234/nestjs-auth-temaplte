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
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest() as IAuthReq;
      const authHeader = request.header('authorization');

      if (!authHeader.includes('Bearer ')) {
        throw new UnauthorizedException('invalid-auth-header');
      }

      const accessToken = authHeader.split(' ')[1];

      if (!accessToken) {
        throw new UnauthorizedException('no-access-token-sent');
      }

      const payload = verify(
        accessToken,
        this.configService.get('ACCESS_TOKEN_SECRET'),
      ) as ITokenPayload;

      if (!payload.sub) {
        throw new UnauthorizedException('invalid-access-token');
      }

      const foundUser = await this.userService.findByIdOrFail(payload.sub);

      if (foundUser.tokenVersion !== payload.version) {
        throw new UnauthorizedException('invalid-access-token');
      }

      request.user = foundUser;

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
