import { Product } from './product.schema'
import { PaginationSchema, SortSchema } from 'src/common/schema'

type Pagination = PaginationSchema
type Sort = SortSchema

export class Products extends Product {
  products: Product[]
  pagination: Pagination
  sort: Sort[]
}
