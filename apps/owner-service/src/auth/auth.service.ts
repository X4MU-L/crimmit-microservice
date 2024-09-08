import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@app/shared/repository';
import { UserSignInDto, UserSignupDto } from '@app/shared/dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(data: UserSignupDto) {
    return this.userRepo.createUser(data);
  }

  async signIn(data: UserSignInDto) {
    const user = await this.userRepo.signInUser(data);
    const token = await this.jwtService.signAsync(user, {
      secret: `${process.env.JWT_SECRET}`,
    });
    return { token, success: true };
  }
}
