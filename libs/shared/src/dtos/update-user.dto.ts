import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName: string;
  @IsOptional()
  @IsString()
  lastName: string;
  @IsOptional()
  @IsString()
  username: string;
}

export class UpdateUserPayloadDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
  data: UpdateUserDto;
}
