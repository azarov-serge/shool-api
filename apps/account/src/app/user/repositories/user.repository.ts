import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entites/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async createUser(user: UserEntity) {
    const newUser = new this.userModel(user);

    return newUser.save();
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async deleteUserByEmail(email: string) {
    this.userModel.deleteOne({ email }).exec();
  }
}
