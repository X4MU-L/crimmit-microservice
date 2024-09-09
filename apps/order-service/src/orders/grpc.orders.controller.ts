import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  UpdateProductDTO,
  Products,
  UPDATE_PRODUCT_SERVICE_NAME,
} from '@app/shared/proto/updateProduct';
import { OrderRepository } from '@app/shared';
import {
  Orders,
  UPDATE_ORDER_SERVICE_NAME,
  UpdateOrderDTO,
} from '@app/shared/proto/updateOrder';
import { Observable } from 'rxjs';

@Controller('grpc')
export class GRPCProductUpdateController {
  constructor(private readonly productRepo: OrderRepository) {}

  @GrpcMethod(UPDATE_ORDER_SERVICE_NAME)
  updateOrder(
    request: UpdateOrderDTO,
  ): Promise<Orders> | Observable<Orders> | Orders {
    console.log('User update event received');
    return {
      _id: 'hsjs',
      productIds: ['hhhj'],
      quantity: 8,
      totalPrice: 290,
    };
  }
}
