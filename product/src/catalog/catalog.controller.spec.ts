import { Test, TestingModule } from '@nestjs/testing'
import { CatalogController } from './catalog.controller'
import { CatalogService } from './catalog.service'

describe('AppController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [CatalogService],
    }).compile()
  })

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<CatalogController>(CatalogController)
      expect(appController.getHello()).toBe('Hello World!')
    })
  })
})
