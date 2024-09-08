import { HTTPAppAuthGuard, TOKENGuard } from '@app/shared/guards';
import {
  Controller,
  Get,
  Inject,
  Post,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtForUserID } from '../decorators';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '@app/shared/dtos';

@Controller('user')
@UseGuards(AuthGuard('jwtToken'))
export class UserController {
  constructor(@Inject('OWNER_SERVICE') private ownerService: ClientProxy) {}
  @Get()
  async getProduct(@JwtForUserID() uid: string) {
    return this.ownerService.send(
      {
        cmd: 'get-user',
      },
      { userId: uid },
    );
  }
  @Patch('update')
  async createProduct(
    @Body() body: UpdateUserDto,
    @JwtForUserID() uid: string,
  ) {
    return this.ownerService.send(
      {
        cmd: 'update-user',
      },
      { userId: uid, data: body },
    );
  }
}
