import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RabbitMQEventService } from '@app/shared';
import {
  UPDATE_ORDER_SERVICE_NAME,
  UpdateOrderDTO,
  UpdateOrderServiceClient,
} from '@app/shared/proto/updateOrder';

@Injectable()
export class OrderUpdateConsumer {
  private grpcClient: UpdateOrderServiceClient;

  constructor(
    @Inject(UPDATE_ORDER_SERVICE_NAME) private client: ClientGrpc,
    private rabbitMQService: RabbitMQEventService,
  ) {
    this.grpcClient = this.client.getService(UPDATE_ORDER_SERVICE_NAME);
    this.rabbitMQService
      .connect()
      .then(() => {
        this.rabbitMQService.consume(
          'product_updates',
          this.handleUpdate.bind(this),
        );
      })
      .catch((err) => {
        console.log('unable to connnect', err);
      });
  }

  async handleUpdate(updateRequest: UpdateOrderDTO) {
    try {
      // Call the gRPC service
      await lastValueFrom(this.grpcClient.updateOrder(updateRequest));
    } catch (error) {
      // Re-publish for retry logic
      await this.rabbitMQService.publish('product_updates', updateRequest);
    }
  }
}
