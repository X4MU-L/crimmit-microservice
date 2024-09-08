import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  UpdateProductDTO,
  Products,
  UPDATE_PRODUCT_SERVICE_NAME,
} from '@app/shared/proto/updateProduct';
import { OrderRepository } from '@app/shared';

@Controller('grpc')
export class CrimmitGRPCProductController {
  constructor(private readonly productRepo: OrderRepository) {}
  @GrpcMethod(UPDATE_PRODUCT_SERVICE_NAME)
  async updateProduct(request: UpdateProductDTO): Promise<Products> {
    console.log('User update event received');

    const { user, data } = request;
    const userProducts = await this.productRepo.getAllUserProducts(
      user._id.toString(),
    );
    console.log(userProducts, data, 'data and products');
    await Promise.all(
      userProducts.map(async (product) => {
        this.productRepo.update(product._id, {
          user: { ...product.user, ...data },
        });
        this.productRepo.save(product);
      }),
    );
    // Return the updated products wrapped in the Products interface
    return { products: userProducts };
  }
}
