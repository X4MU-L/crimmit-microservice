import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenRequest } from '../interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtTokenStrategy extends PassportStrategy(Strategy, 'jwtToken') {
  constructor(private configService: ConfigService) {
    console.log('strategy', process.env.JWT_SECRET);
    super({
      secretOrKey: `${process.env.JWT_SECRET}`,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payLoad: TokenRequest) {
    console.log(payLoad);
    return { ...payLoad };
  }
}
