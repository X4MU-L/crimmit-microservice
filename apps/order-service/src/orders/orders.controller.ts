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
import { CreateOrderDto, UpdateOrderDto } from '@app/shared/dtos';

@Controller('order')
export class ProductController {
  constructor(
    private readonly orderService: OrderService,
    private readonly sharedLib: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-all-user-orders' })
  async getAllOrder(
    @Ctx() context: RmqContext,
    @Payload('userId') userId: string,
  ) {
    this.sharedLib.acknowledgeMessage(context);
    return this.orderService.getAllOrders(userId);
  }

  @MessagePattern({ cmd: 'get-a-user-order' })
  async getAnOrder(
    @Ctx() context: RmqContext,
    @Payload('orderId') orderId: string,
    @Payload('userId') userId: string,
  ) {
    this.sharedLib.acknowledgeMessage(context);
    return this.orderService.getAnOrder(orderId, userId);
  }

  @MessagePattern({ cmd: 'create-order' })
  async createorder(
    @Ctx() context: RmqContext,
    @Payload() payload: { data: CreateOrderDto; user: UserEntity },
  ) {
    this.sharedLib.acknowledgeMessage(context);
    console.log('create product', payload);
    return this.orderService.createOrder(payload);
  }

  @MessagePattern({ cmd: 'update-order' })
  async updateOrder(
    @Ctx() context: RmqContext,
    @Payload()
    payload: {
      data: UpdateOrderDto;
      userId: string;
      orderId: string;
    },
  ) {
    this.sharedLib.acknowledgeMessage(context);
    return this.orderService.updateOrder(payload);
  }
}
