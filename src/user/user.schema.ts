import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

const userModelName = 'User';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, trim: true })
  instagram_id: string;

  @Prop({type: String, required: true, trim:true})
  useranme: string;

  @Prop({type: String, trim:true})
  full_name: string;
  
  @Prop({type: Number})
  logStatus: number;

  @Prop({ type: String, required: false, default: '' })
  facebookToken: string;

  @Prop({ type: Number, required: false, default: 0 })
  facebookTokenExpiration: number;

  @Prop({ type: Date, required: false, default: Date.now() })
  added_date: Date;

  @Prop({ type: Date, required: false, default: Date.now() })
  last_check_date: Date;
}

const UserSchema = SchemaFactory.createForClass(User);


export const UserConfig = {
  name: userModelName,
  schema: UserSchema,
  collection: 'users',
};