import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateOrderDto {
  @IsArray()
  productIds: Array<string>;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  quantity: number;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  totalPrice: number;
}
