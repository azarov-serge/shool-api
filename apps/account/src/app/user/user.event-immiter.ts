import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from './entites/user.entity';

@Injectable()
export class UserEventImmiter {
  constructor(private readonly rmqService: RMQService) {}

  async handle(user: UserEntity) {
    for (const event of user.events) {
      await this.rmqService.notify(event.topic, event.data);
    }
  }
}
