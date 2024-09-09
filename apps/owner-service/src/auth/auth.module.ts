import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from '@app/shared/repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicMongoModule, SharedService } from '@app/shared';
import { OrderEntity, ProductEntity, UserEntity } from '@app/shared/entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
  imports: [
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    DynamicMongoModule.register(
      { name: 'owner-service', database: 'owner-database' },
      [UserEntity, ProductEntity, OrderEntity],
    ),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [JwtService, UserRepository, SharedService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
