import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;
  @IsOptional()
  @IsString()
  description: string;
}
