import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CatalogModule } from 'src/catalog/catalog.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/products'),
    CatalogModule,
  ],
})
export class AppModule {}
