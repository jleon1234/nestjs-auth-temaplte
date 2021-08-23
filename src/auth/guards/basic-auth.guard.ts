import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { IAuthReq } from 'src/shared/interfaces/auth-req';
import { isEmail } from 'src/shared/validation';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as IAuthReq;

    const body = request.body;

    if (!body) {
      throw new BadRequestException('no-data-sent');
    }

    if (!body.email) {
      throw new BadRequestException('no-username-sent');
    }

    if (!isEmail(body.email)) {
      throw new BadRequestException('invalid-email');
    }

    if (!body.password) {
      throw new BadRequestException('no-password-sent');
    }

    const foundUser = await this.userService.findByEmail(body.email);

    if (!foundUser) {
      throw new UnauthorizedException('invalid-credentials');
    }

    const isPasswordValid = await compare(body.password, foundUser.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid-credentials');
    }

    request.user = foundUser;

    return true;
  }
}
