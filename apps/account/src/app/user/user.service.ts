import { Injectable } from '@nestjs/common';
import {
  AccountBuyCourse,
  AccountChangeProfile,
  AccountCheckPayment,
} from '@school/contracts';
import { IUser } from '@school/interfaces';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from './entites/user.entity';
import { UserRepository } from './repositories/user.repository';
import { BuyCourseSaga } from './sagas/buy-course.saga';
import { UserEventImmiter } from './user.event-immiter';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly userEventImmiter: UserEventImmiter
  ) {}

  public async changeProfile(
    user: Pick<IUser, 'displayName'>,
    id: string
  ): Promise<AccountChangeProfile.Response> {
    const existedUser = await this.userRepository.findUserById(id);

    if (!existedUser) {
      throw Error('User not found');
    }

    const userEntity: UserEntity = new UserEntity(existedUser).updateProfile(
      user.displayName
    );

    await this.updateUser(userEntity);

    return {};
  }

  public async buyCourse(
    userId: string,
    courseId: string
  ): Promise<AccountBuyCourse.Response> {
    const existedUser = await this.userRepository.findUserById(userId);

    if (!existedUser) {
      throw new Error('User not found');
    }

    const userEntity = new UserEntity(existedUser);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);

    const { user, paymentLink } = await saga.getState().pay();

    await this.updateUser(user);

    return { paymentLink };
  }

  public async checkPayment(
    userId: string,
    courseId: string
  ): Promise<AccountCheckPayment.Response> {
    const existedUser = await this.userRepository.findUserById(userId);

    if (!existedUser) {
      throw new Error('User not found');
    }

    const userEntity = new UserEntity(existedUser);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, status } = await saga.getState().checkPayment();

    await this.updateUser(user);

    return { status };
  }

  private updateUser(user: UserEntity) {
    return Promise.all([
      this.userEventImmiter.handle(user),
      this.userRepository.updateUser(user),
    ]);
  }
}
