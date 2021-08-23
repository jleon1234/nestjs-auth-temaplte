import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthReq } from 'src/shared/interfaces/auth-req';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class RecoverPasswordGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as IAuthReq;

    const hash = await request.body.hash;

    if (!hash) {
      throw new UnauthorizedException('invalid-hash');
    }

    const foundUser = await this.userService.findByRecoverHashOrFail(hash);

    request.user = foundUser;

    return true;
  }
}
