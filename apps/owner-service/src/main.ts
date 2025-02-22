import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import {
  HttpExceptionFilter,
  RpcExceptionFilter,
} from '@app/shared/exception-handlers';
import { AppModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sharedService = app.get(SharedService);
  app.useGlobalFilters(new RpcExceptionFilter());
  const RMQqueue = sharedService.getRMQOptions(
    process.env.RABBITMQ_OWNER_QUEUE,
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.connectMicroservice<MicroserviceOptions>(RMQqueue);
  app.startAllMicroservices();
}
bootstrap();
