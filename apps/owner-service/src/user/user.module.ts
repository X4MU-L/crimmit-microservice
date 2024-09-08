import { Module } from '@nestjs/common';
import { UserRepository } from '@app/shared/repository';
import { ClientsModule } from '@nestjs/microservices';
import {
  UPDATE_PRODUCT_PACKAGE_NAME,
  UPDATE_PRODUCT_SERVICE_NAME,
} from '@app/shared/proto/updateProduct';
import { RabbitMQEventService, SharedModule, SharedService } from '@app/shared';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { UserUpdateConsumer } from './user-update.consumer';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: UPDATE_PRODUCT_SERVICE_NAME,
        useFactory(config: ConfigService) {
          const GRPC_HOST = config.get('GRPC_HOST');
          const SERVICE_PORT = config.get('PRODUCT_SERVICE_PORT');
          const url = `${GRPC_HOST}:${SERVICE_PORT}`;
          return {
            ...SharedModule.registerGRPC(UPDATE_PRODUCT_PACKAGE_NAME, url),
          };
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    ConfigService,
    UserService,
    UserRepository,
    RabbitMQEventService,
    SharedService,
    UserUpdateConsumer,
  ],
  exports: [UserService],
})
export class UserModule {}
