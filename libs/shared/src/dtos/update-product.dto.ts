import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProductRequestDto {
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name: string;
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;
  @IsOptional()
  @IsString()
  description: string;
}
