import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  UpdateProductDTO,
  UpdateProductServiceClient,
} from '@app/shared/proto/updateProduct';
import { lastValueFrom } from 'rxjs';

import { RabbitMQEventService } from '@app/shared';
import { UPDATE_ORDER_SERVICE_NAME } from '@app/shared/proto/updateOder';

@Injectable()
export class OrderUpdateConsumer {
  private grpcClient: UpdateProductServiceClient; // Replace with your gRPC client type

  constructor(
    @Inject(UPDATE_ORDER_SERVICE_NAME) private client: ClientGrpc,
    private rabbitMQService: RabbitMQEventService,
  ) {
    this.grpcClient = this.client.getService(UPDATE_ORDER_SERVICE_NAME);
    this.rabbitMQService
      .connect()
      .then(() => {
        console.log('connected');
        this.rabbitMQService.consume(
          'product_updates',
          this.handleUpdate.bind(this),
        );
      })
      .catch((err) => {
        console.log('unable to connnect', err);
      });
  }

  async handleUpdate(updateRequest: UpdateProductDTO) {
    try {
      // Call the gRPC service
      await lastValueFrom(this.grpcClient.updateProduct(updateRequest));
    } catch (error) {
      // Re-publish for retry logic
      await this.rabbitMQService.publish('product_updates', updateRequest);
    }
  }
}
