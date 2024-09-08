import { Module } from '@nestjs/common';

import { DynamicMongoModule, SharedModule, SharedService } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity, UserEntity } from '@app/shared/entities';
import { ProductRepository } from '@app/shared/repository/product.repository';
import { CrimmitGRPCProductController } from './grpc.product.controller';
import { ProductController } from './crimmit-product.controller';
import { ProductService } from './crimmit-product.service';
import { OrderUpdateConsumer } from './product-update.consumer';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  UPDATE_ORDER_PACKAGE_NAME,
  UPDATE_ORDER_SERVICE_NAME,
} from '@app/shared/proto/updateOder';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: UPDATE_ORDER_SERVICE_NAME,
        useFactory(config: ConfigService) {
          const GRPC_HOST = config.get('GRPC_HOST');
          const SERVICE_PORT = config.get('ORDER_SERVICE_PORT');
          const url = `${GRPC_HOST}:${SERVICE_PORT}`;
          return {
            ...SharedModule.registerGRPC(UPDATE_ORDER_PACKAGE_NAME, url),
          };
        },
      },
    ]),
    DynamicMongoModule.register({ name: 'hello', database: 'another' }, [
      ProductEntity,
      UserEntity,
    ]),
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  controllers: [ProductController, CrimmitGRPCProductController],
  providers: [
    ProductService,
    ProductRepository,
    SharedService,
    OrderUpdateConsumer,
  ],
})
export class CrimmitProductModule {}
