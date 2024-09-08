import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMQEventService implements OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;
  private assertedQueues: Set<string> = new Set();

  constructor(private readonly config: ConfigService) {}

  async connect() {
    const USER = this.config.get('RABBITMQ_USER');
    const PASSWORD = this.config.get('RABBITMQ_PASS');
    const HOST = this.config.get('RABBITMQ_HOST');

    this.connection = await connect(`amqp://${USER}:${PASSWORD}@${HOST}`);
    this.channel = await this.connection.createChannel();
    console.log('channel connected', this.channel);
  }

  async assertQueue(queue: string) {
    if (!this.assertedQueues.has(queue)) {
      // Check if already asserted
      await this.channel.assertQueue(queue, { durable: true });
      this.assertedQueues.add(queue);
    }
  }

  async publish<T>(queue: string, message: T) {
    await this.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  async consume(queue: string, onMessage: (msg: any) => Promise<void>) {
    await this.assertQueue(queue);
    await this.channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          await onMessage(JSON.parse(msg.content.toString()));
          this.channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel.nack(msg, false, true);
        }
      }
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
