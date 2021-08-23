import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserConfig, UserDocument } from '../user.schema';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(UserConfig.name)
        private readonly UserModel: Model<UserDocument>,
    ) { }

    async findByIdOrFail(id: string): Promise<UserDocument> {
        const foundUser = await this.UserModel.findOne({_id: id});

        if (!foundUser) {
            throw new BadRequestException('user-not-found');
        }

        return foundUser;
    }
}
