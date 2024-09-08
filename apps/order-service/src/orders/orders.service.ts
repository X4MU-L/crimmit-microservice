import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '@app/shared/dtos';
import { UpdateProductRequestDto } from '@app/shared/dtos/update-product.dto';
import { ProductEntity, UserEntity } from '@app/shared/entities';
import { OrderRepository, ProductRepository } from '@app/shared';

@Injectable()
export class OrderService {
  constructor(private productRepo: OrderRepository) {}

  async getAllOrders(userId: string): Promise<ProductEntity[]> {
    return this.productRepo.getAll(userId);
  }

  async getAnOrder(userId: string): Promise<ProductEntity[]> {
    return this.productRepo.getAUserOrder(userId);
  }

  async createOrder(payload: { data: CreateProductDto; user: UserEntity }) {
    return this.productRepo.createOrder(payload); // Save and return the new product
  }

  async updateOrder(payload: {
    data: UpdateProductRequestDto;
    userId: string;
    productId: string;
  }) {
    return this.productRepo.updateOrder(payload);
  }
}
