import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';

@Schema({ collection: 'applications', timestamps: true })
export class Application {
  @Prop({ required: true })
  name: string;
  @Prop()
  screensaver?: string;
}

export type ApplicationDocument = Application & Document;

export const ApplicationSchema = SchemaFactory.createForClass(Application).plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
