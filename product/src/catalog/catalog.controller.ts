import {
  Controller,
  Get,
  Query,
  Param,
  Delete,
  Post,
  Body,
} from '@nestjs/common'
import { CommonSchema } from 'src/common/schema'
import { CatalogService } from './catalog.service'
import { Products } from './schema'
import { ProductDto } from './dto/product.dto'
import { QueryParams, ProductReqParam } from './typings'
import { get } from 'http'

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('ping')
  getPing(): string {
    return this.catalogService.getPing()
  }

  @Post('product/:id?')
  createProductById(
    @Param() params: ProductReqParam,
    @Body() body: ProductDto,
  ): Promise<Products> {
    return this.catalogService.createProductById(params, body)
  }

  @Get('product/:id')
  getProductById(@Param() params: ProductReqParam): Promise<Products> {
    return this.catalogService.getProductById(params)
  }

  @Delete('product/:id')
  deleteProductById(@Param() params: ProductReqParam): Promise<CommonSchema> {
    return this.catalogService.deleteProductById(params)
  }

  @Get('all')
  getAllProducts(@Query() query: QueryParams): Promise<Products> {
    return this.catalogService.getAllProducts(query)
  }

  @Get('productfeed')
  triggerProductFeed(): Promise<CommonSchema> {
    return this.catalogService.triggerProductFeed()
  }
}
