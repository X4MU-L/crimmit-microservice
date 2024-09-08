import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.schema';
import { UserRepository } from './repository/user.repository';
import { SharedService } from './shared.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const url = `mongodb://${config.get('MONGO_HOST')}:${config.get('MONGO_PORT')}/${'my'}`;
        return {
          type: 'mongodb',
          url,
          autoLoadEntities: true,
          synchronize: config.get('STAGE') === 'dev',
        };
      },
    }),
  ],
  providers: [UserRepository, SharedService],
})
export class MongoDbDatabaseModule {}
