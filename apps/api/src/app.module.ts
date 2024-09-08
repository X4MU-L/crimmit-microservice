import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { DynamicMongoModule, SharedModule, UserRepository } from '@app/shared';
import { ProductController } from './controllers/product.controller';
import { AuthController } from './controllers/auth.controller';

import { PassportModule } from '@nestjs/passport';
import {
  JwtTokenStrategy,
  JwtUserStrategy,
} from '@app/shared/guard-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { OrderEntity, ProductEntity, UserEntity } from '@app/shared/entities';

@Module({
  imports: [
    PassportModule,
    DynamicMongoModule.register(
      { name: 'owner-service', database: 'owner-database' },
      [UserEntity, ProductEntity, OrderEntity],
    ),
    TypeOrmModule.forFeature([UserEntity]),
    SharedModule.registerRMQ('OWNER_SERVICE', process.env.RABBITMQ_OWNER_QUEUE),
    SharedModule.registerRMQ(
      'PRODUCT_SERVICE',
      process.env.RABBITMQ_PRODUCT_QUEUE,
    ),
    SharedModule.registerRMQ('ORDER_SERVICE', process.env.RABBITMQ_ORDER_QUEUE),
  ],
  controllers: [ProductController, AuthController, UserController],
  providers: [
    AppService,
    JwtTokenStrategy,
    JwtUserStrategy,
    UserRepository,
    ConfigService,
  ],
})
export class AppModule {}
