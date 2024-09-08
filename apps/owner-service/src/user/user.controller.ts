import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { UpdateUserPayloadDto } from '@app/shared/dtos';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly sharedLib: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Ctx() context: RmqContext, @Payload('userId') userId: string) {
    this.sharedLib.acknowledgeMessage(context);
    return this.userService.getUsers(userId);
  }

  @MessagePattern({ cmd: 'update-user' })
  async updateDetails(
    @Ctx() context: RmqContext,
    @Payload() data: UpdateUserPayloadDto,
  ) {
    this.sharedLib.acknowledgeMessage(context);
    console.log(data);
    if (Object.values(data?.data).some((u) => !!Boolean(u))) {
      return this.userService.updateUser(data);
    }
    return { message: 'no user details updated', success: true };
  }
}
