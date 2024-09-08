import { Controller } from '@nestjs/common';
import { ProductService } from './crimmit-product.service';
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

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly sharedLib: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-all-product' })
  async getAllProducts(@Ctx() context: RmqContext) {
    this.sharedLib.acknowledgeMessage(context);
    return this.productService.getAllProducts();
  }

  @MessagePattern({ cmd: 'get-product-for-user' })
  async getUserProduct(
    @Ctx() context: RmqContext,
    @Payload('userId') userId: string,
  ) {
    this.sharedLib.acknowledgeMessage(context);
    return this.productService.getAllUserProducts(userId);
  }

  @MessagePattern({ cmd: 'get-a-product' })
  async getAProduct(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: string; productId: string },
  ) {
    this.sharedLib.acknowledgeMessage(context);
    return this.productService.getAProduct(payload);
  }

  @MessagePattern({ cmd: 'create-product' })
  async createProduct(
    @Ctx() context: RmqContext,
    @Payload() payload: { data: CreateProductDto; user: UserEntity },
  ) {
    this.sharedLib.acknowledgeMessage(context);
    console.log('create product', payload);
    return this.productService.createProduct(payload);
  }

  @MessagePattern({ cmd: 'update-product' })
  async updateProduct(
    @Ctx() context: RmqContext,
    @Payload()
    payload: {
      data: UpdateProductRequestDto;
      userId: string;
      productId: string;
    },
  ) {
    this.sharedLib.acknowledgeMessage(context);
    return this.productService.updateProduct(payload);
  }
}
