import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedService } from '@app/shared';
import { MicroserviceOptions } from '@nestjs/microservices';
import { UPDATE_PRODUCT_PACKAGE_NAME } from '@app/shared/proto/updateProduct';
import { TransformInterceptor } from '@app/shared/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sharedService = app.get(SharedService);
  const RMQqueue = sharedService.getRMQOptions(
    process.env.RABBITMQ_PRODUCT_QUEUE,
  );
  const GRPC_HOST = process.env.GRPC_HOST;
  const SERVICE_PORT = process.env.PRODUCT_SERVICE_PORT;
  const GRPCproto = sharedService.registerGRPC(
    UPDATE_PRODUCT_PACKAGE_NAME,
    `${GRPC_HOST}:${SERVICE_PORT}`,
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.connectMicroservice<MicroserviceOptions>(RMQqueue);
  app.connectMicroservice<MicroserviceOptions>(GRPCproto);
  await app.startAllMicroservices();
  await app.listen(+SERVICE_PORT);
}
bootstrap();
