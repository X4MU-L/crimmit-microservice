import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserSignInDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
