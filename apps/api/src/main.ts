import { NestFactory, HttpAdapterHost } from '@nestjs/core';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from '@app/shared/transform.interceptor';
import { HttpExceptionFilter } from '@app/shared/exception-handlers';

console.log(process.env);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);
}
bootstrap();

// import { NestFactory, HttpAdapterHost } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { AllExceptionsFilter } from './all-exceptions.filter';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const { httpAdapter } = app.get(HttpAdapterHost);
//   app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

//   app.enableCors();
//   app.setGlobalPrefix('api');
//   await app.listen(3000);
// }
// bootstrap();