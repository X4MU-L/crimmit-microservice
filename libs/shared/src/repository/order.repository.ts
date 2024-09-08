import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ProductEntity, UserEntity } from '../entities'; // Adjust the import path accordingly
import { CreateProductDto } from '@app/shared/dtos'; // Adjust the import path accordingly
import { UpdateProductRequestDto } from '@app/shared/dtos/update-product.dto'; // Adjust the import path accordingly
import * as _ from 'lodash';

@Injectable()
export class OrderRepository extends Repository<ProductEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  // Get all products
  async getAllProducts(): Promise<ProductEntity[]> {
    return this.find(); // Fetch and return all products
  }

  // Get all products for a specific user
  async getAllUserProducts(userId: string): Promise<ProductEntity[]> {
    return this.find({ where: { userId: userId } }); // Fetch products for the given user
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

    console.log(payload);
    const productData = {
      ...data,
      user,
      userId: user._id.toString(), // Use the user's ID
    };

    const product = await this.save(this.create(productData));
    return _.omit(product, ['user']);
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
      throw new Error('Product not found or does not belong to the user'); // Handle not found scenario
    }
    const willUpdate = Object.keys(data).some(
      (key) => data[key] !== (product[key] ? product[key] : data[key]),
    );
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
  }
}
