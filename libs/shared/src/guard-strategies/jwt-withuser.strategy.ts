import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repository/user.repository';
import { Jwtpayload } from '../interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwtUser') {
  constructor(
    private userRepo: UserRepository,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payLoad: Jwtpayload) {
    console.log(payLoad, 'payload');
    const { uid } = payLoad;
    const user = await this.userRepo.getUserById(uid);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
