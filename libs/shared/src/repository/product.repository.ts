import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ProductEntity, UserEntity } from '../entities';
import { CreateProductDto } from '@app/shared/dtos';
import { UpdateProductRequestDto } from '@app/shared/dtos/update-product.dto';
import * as _ from 'lodash';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  // Get all products
  async getAllProducts(): Promise<ProductEntity[]> {
    return this.find();
  }

  // Get all products for a specific user
  async getAllUserProducts(userId: string): Promise<ProductEntity[]> {
    return this.find({ where: { userId: userId } });
  }

  // Get a specific product for a user
  async getAProduct(payload: {
    userId: string;
    productId: string;
  }): Promise<ProductEntity> {
    const { userId, productId } = payload;
    const objectid = new ObjectId(productId);
    return this.findOne({
      where: { _id: objectid, userId: userId },
    });
  }

  // Create a new product
  async createProduct(payload: {
    data: CreateProductDto;
    user: UserEntity;
  }): Promise<Omit<ProductEntity, 'user'>> {
    const { data, user } = payload;

    try {
      const productData = {
        ...data,
        user,
        userId: user._id.toString(), // Use the user's ID
      };
      const product = await this.save(this.create(productData));
      return _.omit(product, ['user']);
    } catch (error) {
      if (+error.code === 23505) {
        throw new ConflictException('Product name already exists');
      }
    }
  }

  // Update a product
  async updateProduct(payload: {
    userId: string;
    data: UpdateProductRequestDto;
    productId: string;
  }) {
    const { data, userId, productId } = payload;
    const objectid = new ObjectId(productId);
    const product = await this.findOne({
      where: { _id: objectid, userId: userId },
    });
    if (!product) {
      throw new NotFoundException(
        'Product not found or does not belong to the user',
      ); // Handle not found scenario
    }
    const willUpdate = Object.keys(data).some(
      (key) => data[key] !== (product[key] ? product[key] : data[key]),
    );
    try {
      if (willUpdate) {
        await this.save(Object.assign(product, data));
        return {
          message: 'product updeated successfully',
          success: true,
          affected: 1,
          product,
        };
      }
      return {
        message: 'no data updated',
        success: true,
        affected: 0,
      };
    } catch (error) {
      if (+error.code === 23505) {
        throw new ConflictException('Product name already exists');
      }
    }
  }
}
