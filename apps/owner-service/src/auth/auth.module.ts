import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from '@app/shared/repository';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicMongoModule, SharedModule, SharedService } from '@app/shared';
import { ProductEntity, UserEntity } from '@app/shared/entities';
import { configValidationSchema } from '@app/shared/config.schema';
import { JwtTokenStrategy } from '@app/shared/guard-strategies';
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
      [UserEntity, ProductEntity],
    ),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [JwtService, UserRepository, SharedService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
