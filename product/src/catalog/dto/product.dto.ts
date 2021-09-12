import { IsNotEmpty } from 'class-validator'
export class ProductDto {
  @IsNotEmpty()
  id: number
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  description: string
  @IsNotEmpty()
  salePrice: number
  @IsNotEmpty()
  regularPrice: number
  @IsNotEmpty()
  imageUrl: string
  @IsNotEmpty()
  inStock: boolean
  @IsNotEmpty()
  quantity: number
  createdDate?: Date
}
