import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ProductEntity, UserEntity } from '../entities';
import { CreateOrderDto, UpdateOrderDto } from '@app/shared/dtos';

import * as _ from 'lodash';

@Injectable()
export class OrderRepository extends Repository<ProductEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  async getAllOrders(userId: string): Promise<ProductEntity[]> {
    return this.find({ where: { userId } });
  }

  async getAnOrder(data: {
    userId: string;
    orderId: string;
  }): Promise<ProductEntity[]> {
    const _id = new ObjectId(data.orderId);
    return this.find({ where: { userId: data.userId, _id } });
  }

  async createOrder(payload: {
    data: CreateOrderDto;
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

  async updateOrder(payload: {
    userId: string;
    data: UpdateOrderDto;
    orderId: string;
  }) {
    const { data, userId, orderId } = payload;
    const objectid = new ObjectId(orderId);
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
