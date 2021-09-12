import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { CommonSchema } from 'src/common/schema/common.schema'

export type ProductDocument = Product & Document

@Schema()
export class Product extends CommonSchema {
  @Prop({ required: true })
  id: number

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  salePrice: number

  @Prop({ required: true })
  regularPrice: number

  @Prop({ required: true })
  imageUrl: string

  @Prop({ required: true })
  inStock: boolean

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true, default: Date.now })
  createdDate: Date
}

export const ProductSchema = SchemaFactory.createForClass(Product)
