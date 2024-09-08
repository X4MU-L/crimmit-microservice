import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { UserSignInDto, UserSignupDto } from '@app/shared/dtos';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedLib: SharedService,
  ) {}

  @MessagePattern({ cmd: 'create-user' })
  async createUser(@Ctx() context: RmqContext, @Payload() data: UserSignupDto) {
    this.sharedLib.acknowledgeMessage(context);
    return this.authService.signUp(data);
  }

  @MessagePattern({ cmd: 'signin-user' })
  async signInUser(@Ctx() context: RmqContext, @Payload() data: UserSignInDto) {
    console.log('user', data);
    this.sharedLib.acknowledgeMessage(context);
    return this.authService.signIn(data);
  }
}
