import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

const port = 3000;
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000/',
    credentials: true
  });
  await app.listen(port);
}
console.log(`Running on http://localhost:${port}`)
bootstrap();
