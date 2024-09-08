import { DynamicModule, Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import {
  ClientProxyFactory,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  providers: [SharedService, ConfigService],
  exports: [SharedService],
})
export class SharedModule {
  static registerRMQ(SERVICE: string, QUEUE: string): DynamicModule {
    const providers = [
      {
        provide: SERVICE,
        async useFactory(config: ConfigService) {
          const USER = config.get('RABBITMQ_USER');
          const PASSWORD = config.get('RABBITMQ_PASS');
          const HOST = config.get('RABBITMQ_HOST');

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              queue: QUEUE,
              queueOptions: {
                durable: true,
              },
            },
          });
        },
        inject: [ConfigService],
      },
    ];
    return {
      module: SharedModule,
      providers,
      exports: providers,
    };
  }
  static registerGRPC(packageName: string, url: string): GrpcOptions {
    const protoPath = join(
      __dirname,
      '..',
      'shared',
      'src',
      'proto',
      `${packageName}.proto`,
    );

    return {
      transport: Transport.GRPC,
      options: {
        loader: {
          keepCase: true,
        },
        url,
        package: packageName,
        protoPath,
      },
    };
  }
}
