import { Module } from '@nestjs/common';
import {
  DynamicMongoModule,
  OrderRepository,
  SharedService,
} from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity, ProductEntity, UserEntity } from '@app/shared/entities';
import { GRPCProductUpdateController } from './grpc.orders.controller';
import { ProductController } from './orders.controller';
import { OrderService } from './orders.service';

const ORDER_SERVICE_NAME = 'ORDER_SERVICE';

@Module({
  imports: [
    DynamicMongoModule.register(
      { name: ORDER_SERVICE_NAME, database: ORDER_SERVICE_NAME },
      [ProductEntity, UserEntity, OrderEntity],
    ),
    TypeOrmModule.forFeature([OrderEntity]),
  ],
  controllers: [ProductController, GRPCProductUpdateController],
  providers: [OrderService, OrderRepository, SharedService],
})
export class CrimmitProductModule {}
