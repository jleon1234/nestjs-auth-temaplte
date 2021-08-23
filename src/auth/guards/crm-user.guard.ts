import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { admin, editor } from 'src/shared/constants';
import { IAuthReq } from 'src/shared/interfaces/auth-req';

@Injectable()
export class CrmUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as IAuthReq;

    if (!request.user) {
      throw new UnauthorizedException('user-not-logged-in');
    }

    if (![admin, editor].includes(request.user.role)) {
      return false;
    }

    return true;
  }
}
