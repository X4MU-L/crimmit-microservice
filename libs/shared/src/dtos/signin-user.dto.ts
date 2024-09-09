import { IsNotEmpty } from 'class-validator';

export class UserSignInDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
