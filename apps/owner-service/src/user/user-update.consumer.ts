import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  UPDATE_PRODUCT_SERVICE_NAME,
  UpdateProductDTO,
  UpdateProductServiceClient,
} from '@app/shared/proto/updateProduct';
import { lastValueFrom } from 'rxjs';
import { RabbitMQEventService } from '@app/shared';

@Injectable()
export class UserUpdateConsumer {
  private grpcClient: UpdateProductServiceClient;
  constructor(
    @Inject(UPDATE_PRODUCT_SERVICE_NAME) private client: ClientGrpc,
    private rabbitMQService: RabbitMQEventService,
  ) {
    this.grpcClient = this.client.getService(UPDATE_PRODUCT_SERVICE_NAME);
    this.rabbitMQService
      .connect()
      .then(() => {
        console.log('connected');
        this.rabbitMQService.consume(
          'user_updates',
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
      await this.rabbitMQService.publish('user_updates', updateRequest);
    }
  }
}
