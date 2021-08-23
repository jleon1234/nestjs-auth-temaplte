import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { UserFbService } from './services/user-fb.service';

@Module({
  providers: [UserService, UserFbService],
  controllers: [UserController]
})
export class UserModule {}
