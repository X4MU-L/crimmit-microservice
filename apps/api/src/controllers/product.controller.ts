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
import { CreateProductDto } from '@app/shared/dtos';
import { UpdateProductRequestDto } from '@app/shared/dtos/update-product.dto';

@Controller('product')
@UseGuards(AuthGuard('jwtToken'))
export class ProductController {
  constructor(@Inject('PRODUCT_SERVICE') private productService: ClientProxy) {}
  @Get()
  async getAllProduct() {
    console.log('came here');
    return this.productService.send(
      {
        cmd: 'get-all-product',
      },
      {},
    );
  }
  @Get('user/:id')
  async getUserProduct(@JwtForUserID() uid: string) {
    console.log('data-payload', uid);
    return this.productService.send(
      {
        cmd: 'get-product-for-user',
      },
      { userId: uid },
    );
  }
  @Get(':id')
  async getAProduct(@Param('id') id: string, @JwtForUserID() uid: string) {
    return this.productService.send(
      {
        cmd: 'get-a-product',
      },
      { userId: uid, productId: id },
    );
  }
  @Post('create')
  @UseGuards(AuthGuard('jwtUser'))
  async createProduct(
    @Body() body: CreateProductDto,
    @JwtUser() user: UserEntity,
  ) {
    console.log('data-payload', body, user);
    return this.productService.send(
      {
        cmd: 'create-product',
      },
      { data: body, user },
    );
  }

  @Patch('update/:id')
  async updateProduct(
    @Body() body: UpdateProductRequestDto,
    @JwtForUserID() userId: string,
    @Param('id') productId: string,
  ) {
    return this.productService.send(
      {
        cmd: 'update-product',
      },
      { data: body, userId, productId },
    );
  }
}
