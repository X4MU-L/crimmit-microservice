import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GrpcOptions,
  RmqContext,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';

@Injectable()
export class SharedService {
  constructor(private readonly config: ConfigService) {}

  getRMQOptions(queue: string): RmqOptions {
    const USER = this.config.get('RABBITMQ_USER');
    const PASSWORD = this.config.get('RABBITMQ_PASS');
    const HOST = this.config.get('RABBITMQ_HOST');

    console.log(`amqp://${USER}:${PASSWORD}@${HOST}`, 'connect string');
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
        noAck: false,
        queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  registerGRPC(packageName: string, url: string): GrpcOptions {
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
  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    console.log('logs --message--acknowledge');
    // console.log(channel, message);
  }
}
