import { PurchasesState } from '@school/interfaces';
import { UserEntity } from '../entites/user.entity';
import { RMQService } from 'nestjs-rmq';
import { BuyCourseSagaState } from './buy-course.state';
import {
  BuyCourseSagaStateCanceled,
  BuyCourseSagaStateWaitingForPayment,
  BuyCourseSagaStatePurchased,
  BuyCourseSagaStateStarted,
} from './buy-course.steps';

export class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(
    public user: UserEntity,
    public courseId: string,
    public rmqService: RMQService
  ) {}

  public getState() {
    return this.state;
  }

  public setState(state: PurchasesState, courseId: string) {
    switch (state) {
      case PurchasesState.Started:
        this.state = new BuyCourseSagaStateStarted();
        break;

      case PurchasesState.WaitingForPayment:
        this.state = new BuyCourseSagaStateWaitingForPayment();

        break;

      case PurchasesState.Purchased:
        this.state = new BuyCourseSagaStatePurchased();

        break;

      case PurchasesState.Cancaled:
        this.state = new BuyCourseSagaStateCanceled();

        break;
    }

    this.state.setContext(this);
    this.user.setCourseStatus(courseId, state);
  }
}
