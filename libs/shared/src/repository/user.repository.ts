import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { DataSource, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { UserEntity } from '../entities';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserPayloadDto, UserSignInDto, UserSignupDto } from '../dtos';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async getUserById(id: string) {
    const userID = new ObjectId(id);
    return this.findOne({
      where: { _id: userID },
      select: ['_id', 'firstName', 'lastName', 'email', 'username'],
    });
  }
  async createUser(data: UserSignupDto) {
    try {
      const { password } = data;
      const salt = await bcrypt.genSalt();
      const hasshedPassword = await bcrypt.hash(password, salt);
      return await this.save(
        this.create({ ...data, password: hasshedPassword }),
      );
    } catch (error) {
      if (+error.code === 23505) {
        throw new ConflictException('Username or Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async signInUser(data: UserSignInDto) {
    const { username, password } = data;
    try {
      const user = await this.findOne({
        where: { username },
        select: ['_id', 'firstName', 'lastName', 'password'],
      });
      if (user && (await bcrypt.compare(password, user.password))) {
        return {
          uid: user._id.toString(),
        };
      }
    } catch (error) {
      console.log(error, 'this ------------------');
      return { notfound: 'user' };
    }

    throw new UnauthorizedException('Username or Password is incorrect');
  }

  async updateUser(data: UpdateUserPayloadDto) {
    try {
      const userID = new ObjectId(data.userId);
      // this could be done with joi
      const updatable = Object.keys(data.data).reduce((acc, curr) => {
        if (!!data.data[curr]) {
          acc[curr] = data.data[curr];
          return acc;
        }
        return acc;
      }, {});
      console.log(updatable, 'updatabe');
      const { affected } = await this.update(
        userID,
        _.omit(updatable, ['password']),
      );

      const user = affected > 0 ? await this.getUserById(data.userId) : null;
      console.log(user, 'fetched user');
      return {
        message: affected > 0 ? 'updated successfully' : 'no updates to apply',
        affected,
        ...(affected > 0 ? { user } : {}),
      };
    } catch (error) {
      throw error;
    }
  }
}
