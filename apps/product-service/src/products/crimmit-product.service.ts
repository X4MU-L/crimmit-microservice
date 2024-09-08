import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '@app/shared/dtos';
import { UpdateProductRequestDto } from '@app/shared/dtos/update-product.dto';
import { ProductEntity, UserEntity } from '@app/shared/entities';
import { ProductRepository, RabbitMQEventService } from '@app/shared';

@Injectable()
export class ProductService {
  constructor(
    private productRepo: ProductRepository,
    private readonly rabbitMQService: RabbitMQEventService,
  ) {}

  // Get all products
  async getAllProducts(): Promise<ProductEntity[]> {
    return this.productRepo.getAllProducts();
  }

  // Get all products for a specific user
  async getAllUserProducts(userId: string): Promise<ProductEntity[]> {
    return this.productRepo.getAllUserProducts(userId);
  }

  async getAProduct(payload: {
    userId: string;
    productId: string;
  }): Promise<ProductEntity> {
    return this.productRepo.getAProduct(payload);
  }

  // Create a new product
  async createProduct(payload: { data: CreateProductDto; user: UserEntity }) {
    return this.productRepo.createProduct(payload);
  }

  // Update a product
  async updateProduct(payload: {
    data: UpdateProductRequestDto;
    userId: string;
    productId: string;
  }) {
    try {
      const result = await this.productRepo.updateProduct(payload);
      if (result.affected > 0) {
        await this.rabbitMQService.publish('product_updates', payload);
        return result;
      }
    } catch (error) {
      console.log(error);
      return { error: true };
    }
  }
}
