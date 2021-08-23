import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import axios from 'axios';

@Injectable()
export class UserFbService {

    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) { }

    async set(userId: string, facebookToken: string) {
        try {
            const foundUser = await this.userService.findByIdOrFail(userId);
            const fbUrl = this.configService.get('FACEBOOK_URL');
            const fbAppId = this.configService.get('FACEBOOK_APP');
            const fbAppSecret = this.configService.get('FACEBOOK_SECRET');

            const res = await axios.get(`${fbUrl}/oauth/access_token`, {
                params: {
                    grant_type: 'fb_exchange_token',
                    client_id: fbAppId,
                    client_secret: fbAppSecret,
                    fb_exchange_token: facebookToken,
                },
            });

            foundUser.facebookToken = res.data.access_token;
            foundUser.facebookTokenExpiration =
                Date.now() + res.data.expires_in * 1000;
            const updatedUser = await foundUser.save();

            return updatedUser;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(
                error.message || 'check-server-logs',
            );
        }
    }

}
