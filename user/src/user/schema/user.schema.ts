import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { CommonSchema } from 'src/common/schema'

export type UserDocument = User & Document

@Schema()
export class User extends CommonSchema {
  @Prop()
  id: string

  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  phone: string

  @Prop()
  type: string

  @Prop({ required: true, default: Date.now })
  createdDate: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
