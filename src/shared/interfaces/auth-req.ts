import { Request } from 'express';
import { UserDocument } from 'src/user/user.schema';

export interface IAuthReq extends Request {
  user: UserDocument;
}
