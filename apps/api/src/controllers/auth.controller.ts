import { Controller, Get, Inject, Post, Body, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserSignupDto, UserSignInDto } from '@app/shared/dtos';

@Controller('auth')
export class AuthController {
  constructor(@Inject('OWNER_SERVICE') private ownerService: ClientProxy) {}

  @Get()
  async getUser() {
    return this.ownerService.send(
      {
        cmd: 'get-user',
      },
      {},
    );
  }
  @Post('signup')
  async createUser(@Body() body: UserSignupDto) {
    try {
      return this.ownerService.send(
        {
          cmd: 'create-user',
        },
        body,
      );
    } catch (err) {
      console.log('signup error', err);
    }
  }
  @Post('signin')
  async signInUser(@Body() body: UserSignInDto) {
    try {
      return this.ownerService.send(
        {
          cmd: 'signin-user',
        },
        body,
      );
    } catch (err) {
      console.log('signin error', err);
    }
  }
}
