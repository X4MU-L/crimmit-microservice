import {
  Controller,
  Get,
  Inject,
  Post,
  Body,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtForUserID, JwtUser } from '../decorators';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '@app/shared/entities';
import { CreateOrderDto, UpdateOrderDto } from '@app/shared/dtos';

@Controller('order')
@UseGuards(AuthGuard('jwtToken'))
export class ProductController {
  constructor(@Inject('ORDER_SERVICE') private orderService: ClientProxy) {}
  @Get()
  async getAllOrders(@JwtForUserID() userId: string) {
    return this.orderService.send(
      {
        cmd: 'get-all-user-orders',
      },
      { userId },
    );
  }
  @Get(':id')
  async getAnOrder(
    @Param('id') orderId: string,
    @JwtForUserID() userId: string,
  ) {
    return this.orderService.send(
      {
        cmd: 'get-a-user-order',
      },
      { orderId, userId },
    );
  }

  @Post('create')
  @UseGuards(AuthGuard('jwtUser'))
  async createOrder(@Body() body: CreateOrderDto, @JwtUser() user: UserEntity) {
    return this.orderService.send(
      {
        cmd: 'create-order',
      },
      { data: body, user },
    );
  }

  @Patch('update/:id')
  async updateOrder(
    @Body() body: UpdateOrderDto,
    @JwtForUserID() userId: string,
    @Param('id') orderId: string,
  ) {
    return this.orderService.send(
      {
        cmd: 'update-order',
      },
      { data: body, userId, orderId },
    );
  }
}
