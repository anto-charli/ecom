import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(
    session({
      secret: 'my-secret-key',
      resave: false,
      saveUninitialized: false,
      name: 'sessionId',
    }),
  )
  await app.listen(5001)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
