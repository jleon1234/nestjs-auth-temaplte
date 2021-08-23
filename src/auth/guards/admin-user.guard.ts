import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { admin } from 'src/shared/constants';
import { IAuthReq } from 'src/shared/interfaces/auth-req';

@Injectable()
export class AdminUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as IAuthReq;

    if (!request.user) {
      throw new UnauthorizedException('user-not-logged-in');
    }

    if (request.user.role !== admin) {
      return false;
    }

    return true;
  }
}
