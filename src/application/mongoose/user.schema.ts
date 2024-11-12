import { Role } from '@/core/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';

@Schema({ _id: false })
export class Session {
  @Prop()
  token: string;
  @Prop()
  refreshToken?: string;
}

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, default: Role.USER, enum: Role })
  role: Role;
  @Prop()
  session?: Session;
}

export type UserDocument = User & Document & MongooseDelete.SoftDeleteDocument;

export const UserSchema = SchemaFactory.createForClass(User).plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
