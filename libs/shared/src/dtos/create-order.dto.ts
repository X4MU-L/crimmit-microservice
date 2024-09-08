import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  productIds: Array<string>;
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  quantity: number;
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  totalPrice: number;
}
