import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { UserDocument } from 'src/user/user.schema';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  getAccessToken(user: UserDocument) {
    return sign(
      { sub: user.id, instagram_id: user.instagram_id },
      this.configService.get('ACCESS_TOKEN_SECRET'),
      { expiresIn: '15m' },
    );
  }

  getRefreshToken(user: UserDocument) {
    return sign(
      { sub: user.id, instagram_id: user.instagram_id },
      this.configService.get('REFRESH_TOKEN_SECRET'),
      { expiresIn: '7d' },
    );
  }
}
