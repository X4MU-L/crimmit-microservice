import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configValidationSchema,
    }),
  ],
})
export class DynamicMongoModule {
  static register(
    dbConfig: { name: string; database: string },
    entities: Function[],
  ): DynamicModule {
    return {
      module: DynamicMongoModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => {
            const url = `mongodb://${config.get('MONGO_HOST')}:${config.get('MONGO_PORT')}/${dbConfig.database}`;
            return {
              name: dbConfig.name,
              type: 'mongodb',
              url,
              entities,
              synchronize: config.get('STAGE') === 'dev',
            };
          },
        }),
      ],
    };
  }
}
