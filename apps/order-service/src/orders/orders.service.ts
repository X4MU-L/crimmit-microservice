import { Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from '@app/shared/dtos';
import { ProductEntity, UserEntity } from '@app/shared/entities';
import { OrderRepository } from '@app/shared';

@Injectable()
export class OrderService {
  constructor(private orderRepo: OrderRepository) {}

  async getAllOrders(userId: string): Promise<ProductEntity[]> {
    return this.orderRepo.getAllOrders(userId);
  }

  async getAnOrder(orderId: string, userId: string): Promise<ProductEntity[]> {
    return this.orderRepo.getAnOrder({ userId, orderId });
  }

  async createOrder(payload: { data: CreateOrderDto; user: UserEntity }) {
    return this.orderRepo.createOrder(payload); // Save and return the new product
  }

  async updateOrder(payload: {
    data: UpdateOrderDto;
    userId: string;
    orderId: string;
  }) {
    return this.orderRepo.updateOrder(payload);
  }
}
