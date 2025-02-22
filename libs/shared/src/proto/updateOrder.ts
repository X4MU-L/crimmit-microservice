// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.0
// source: updateOder.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ObjectId } from 'typeorm';

export const protobufPackage = 'updateOrder';

export interface Orders {
  _id: string | ObjectId;
  productIds: string[];
  quantity: number;
  totalPrice: number;
}

export interface UpdateOrderDTO {
  userId: string;
  productId: string;
  data: UpdateAbleData | undefined;
}

export interface UpdateAbleData {
  name?: string | undefined;
  price?: number | undefined;
  description?: string | undefined;
}

export const UPDATE_ORDER_PACKAGE_NAME = 'updateOrder';

export interface UpdateOrderServiceClient {
  updateOrder(request: UpdateOrderDTO): Observable<Orders>;
}

export interface UpdateOrderServiceController {
  updateOrder(
    request: UpdateOrderDTO,
  ): Promise<Orders> | Observable<Orders> | Orders;
}

export function UpdateOrderServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['updateOrder'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UpdateOrderService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('UpdateOrderService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const UPDATE_ORDER_SERVICE_NAME = 'UpdateOrderService';
