import { Injectable } from '@nestjs/common';

import { RabbitMQEventService, UserRepository } from '@app/shared';
import { ObjectId } from 'mongodb';
import { UpdateUserPayloadDto } from '@app/shared/dtos';

@Injectable()
export class UserService {
  constructor(
    private rabbitMQService: RabbitMQEventService,
    private userRepo: UserRepository,
  ) {}

  async getUsers(userId: string) {
    return this.userRepo.getUserById(userId);
  }

  async updateUser(payload: UpdateUserPayloadDto) {
    try {
      const updated = await this.userRepo.updateUser(payload);
      if (updated.affected > 0) {
        const data = { data: payload.data, user: updated.user };
        await this.rabbitMQService.publish('user_updates', data);
      }
      return updated;
    } catch (error) {
      console.log(error);
      return {"error": true};
    }
    // Publish update request
  }
}
