import { Controller } from '@nestjs/common';
import { OrderService } from './orders.service';
import { UserEntity } from '@app/shared/entities';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { CreateProductDto } from '@app/shared/dtos';
import { UpdateProductRequestDto } from '@app/shared/dtos/update-product.dto';

@Controller('order')
export class ProductController {
  constructor(
    private readonly productService: OrderService,
    private readonly sharedLib: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-all-user-orders' })
  async getAllOrder(
    @Ctx() context: RmqContext,
    @Payload('userId') userId: string,
  ) {
    this.sharedLib.acknowledgeMessage(context);
    return this.productService.getAllOrders(userId);
  }

  @MessagePattern({ cmd: 'get-a-user-order' })
  async getAnOrder(
    @Ctx() context: RmqContext,
    @Payload('orderId') orderId: string,
    @Payload('userId') userId: string,
  ) {
    this.sharedLib.acknowledgeMessage(context);
    return this.productService.getAnOrder(orderId, userId);
  }

  @MessagePattern({ cmd: 'create-order' })
  async createorder(
    @Ctx() context: RmqContext,
    @Payload() payload: { data: CreateProductDto; user: UserEntity },
  ) {
    this.sharedLib.acknowledgeMessage(context);
    console.log('create product', payload);
    return this.productService.createOrder(payload);
  }

  @MessagePattern({ cmd: 'update-order' })
  async updateOrder(
    @Ctx() context: RmqContext,
    @Payload()
    payload: {
      data: UpdateProductRequestDto;
      userId: string;
      orderId: string;
    },
  ) {
    this.sharedLib.acknowledgeMessage(context);
    return this.productService.updateOrder(payload);
  }
}
