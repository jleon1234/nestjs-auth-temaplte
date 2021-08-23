import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [UserModule],
  providers: [AuthService, TokenService],
})
export class AuthModule {}
