import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ProductDocument, Product, Products } from './schema'
import { SortSchema, SortingKeys, CommonSchema } from 'src/common/schema'
import {
  QueryParams,
  SelectedSortParams,
  SortValues,
  GetSortQuery,
} from './typings'
import { ProductDto } from './dto/product.dto'

@Injectable()
export class CatalogService {
  OFF_SET = 0
  MAX_LIMIT = 10
  SORT: SortingKeys = SortingKeys.NEW_ARRIVAL

  constructor(
    @InjectModel(Product.name)
    private readonly catalogModel: Model<ProductDocument>,
  ) {}

  getPing(): string {
    return 'Catalog service reply - ' + new Date()?.getTime()
  }

  getSortValue = (): SortValues[] => {
    return [
      {
        id: SortingKeys.NEW_ARRIVAL,
        value: 'New Arrival',
        schema: { key: 'createdDate' },
      },
      {
        id: SortingKeys.PRICE_ASC,
        value: 'Price low to high',
        schema: { key: 'salePrice' },
      },
      {
        id: SortingKeys.PRICE_DSC,
        value: 'Price high to low',
        schema: { key: 'salePrice' },
      },
    ]
  }

  getSortInfo = (props: SelectedSortParams): SortSchema[] => {
    const { selectedSort } = props
    const sortArray: SortSchema[] = []
    const sortValues = this.getSortValue()

    sortValues.forEach(sort => {
      sortArray.push({
        id: SortingKeys[sort?.id],
        value: sort?.value,
        selected: sort?.id == selectedSort,
      })
    })

    return sortArray
  }

  getSortQuery = (props: GetSortQuery) => {
    const { sortId } = props
    const sortKey = this.getSortValue()

    const sortSchema = sortKey.find(sort => {
      return sort.id == sortId
    })

    return {
      [sortSchema.schema.key ?? '']: sortSchema?.id
        ?.toLowerCase()
        ?.includes('_dsc')
        ? 'desc'
        : 'asc',
    }
  }

  async getAllProducts(query: QueryParams): Promise<Products> {
    let response
    let responseMessage = 'success'
    let totalCount = 0
    const offset = +query?.offset ?? this.OFF_SET
    const limit = +query?.limit ?? this.MAX_LIMIT
    const sort = query?.sort ?? this.SORT
    const sortQuery = this.getSortQuery({ sortId: sort })

    try {
      response = await this.catalogModel
        .find()
        .sort(sortQuery)
        .skip(offset)
        .limit(limit)
        .exec()
      totalCount = await this.catalogModel.find().countDocuments().exec()
    } catch (e) {
      responseMessage = e
    }

    const products = new Products()
    products.responseMessage = responseMessage
    products.products = response
    products.pagination = {
      count: response?.length ?? 0,
      totalCount: totalCount,
      offset,
      limit,
    }

    products.sort = this.getSortInfo({ selectedSort: sort })

    return products
  }

  async createProductById(params, product: ProductDto): Promise<Products> {
    let response
    let responseMessage = 'success'
    try {
      const filter = { id: params.id || product?.id }
      const options = {
        new: true,
        upsert: true,
        useFindAndModify: false,
      }
      response = await this.catalogModel
        .findOneAndUpdate(filter, product, options)
        .exec()
    } catch (e) {
      responseMessage = e
    }

    let products = new Products()
    products.products = response ?? []
    products.responseMessage = response ? responseMessage : 'Item not found'
    return products
  }

  async getProductById(params): Promise<Products> {
    let response
    let responseMessage = 'success'
    try {
      const filter = { id: params.id }
      response = await this.catalogModel.findOne(filter).exec()
    } catch (e) {
      responseMessage = e
    }

    let products = new Products()
    products.products = response ?? []
    products.responseMessage = response ? responseMessage : 'Item not found'
    return products
  }

  async deleteProductById(params): Promise<CommonSchema> {
    let response
    let responseMessage = 'success'
    try {
      const filter = { id: params.id }
      response = await this.catalogModel.deleteOne(filter).exec()
    } catch (e) {
      responseMessage = e
    }

    let deleteResponse = new CommonSchema()
    deleteResponse.responseMessage =
      response?.deletedCount == 1 ? responseMessage : 'Item not found'
    return deleteResponse
  }

  async triggerProductFeed(): Promise<CommonSchema> {
    let errorString = ''
    let responseMessage = 'success'
    try {
      const { productFixture } = require('./fixture/products')

      const newProductDocuments = productFixture.map(item => {
        const upsertDoc = {
          updateOne: {
            filter: { id: item.id },
            update: { $set: item },
            upsert: true,
          },
        }
        return upsertDoc
      })

      this.catalogModel
        .bulkWrite(newProductDocuments)
        .then(bulkWriteOpResult => {
          responseMessage = 'success'
        })
        .catch(err => {
          responseMessage = 'failure'
          errorString = err
        })
    } catch (e) {
      responseMessage = 'failure'
      errorString = e
    }

    let bulkResponse = new CommonSchema()
    bulkResponse.responseMessage = responseMessage
    bulkResponse.error = errorString
    return bulkResponse
  }
}
