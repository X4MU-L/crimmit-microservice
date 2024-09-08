import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  UpdateProductDTO,
  Product,
  Products,
  UpdateProductServiceController,
  UPDATE_PRODUCT_SERVICE_NAME,
} from '@app/shared/proto/updateProduct';
import { forkJoin, from, Observable } from 'rxjs';

import { ProductService } from './crimmit-product.service';
import { ProductRepository } from '@app/shared';
import { map } from 'lodash';

@Controller('grpc')
export class CrimmitGRPCProductController {
  constructor(private readonly productRepo: ProductRepository) {}
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
