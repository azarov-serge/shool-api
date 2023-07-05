import {
  CourseGetCourse,
  PaymentCheck,
  PaymentGenerateLink,
  PaymentStatus,
} from '@school/contracts';
import { UserEntity } from '../entites/user.entity';
import { BuyCourseSagaState } from './buy-course.state';
import { PurchasesState } from '@school/interfaces';

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{
    paymentLink: string | null;
    user: UserEntity;
  }> {
    const { course } = await this.saga.rmqService.send<
      CourseGetCourse.Request,
      CourseGetCourse.Response
    >(CourseGetCourse.topic, { id: this.saga.courseId });

    if (!course) {
      throw new Error('Course not found');
    }

    if (course.price === 0) {
      this.saga.setState(PurchasesState.Purchased, course._id);

      return { paymentLink: null, user: this.saga.user };
    }

    const { paymentLink } = await this.saga.rmqService.send<
      PaymentGenerateLink.Request,
      PaymentGenerateLink.Response
    >(PaymentGenerateLink.topic, {
      courseId: this.saga.courseId,
      userId: this.saga.user._id,
      sum: course.price,
    });

    this.saga.setState(PurchasesState.WaitingForPayment, course._id);

    return { paymentLink, user: this.saga.user };
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error('Process not started');
  }
  public async cancel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchasesState.Cancaled, this.saga.courseId);

    return { user: this.saga.user };
  }
}

export class BuyCourseSagaStateWaitingForPayment extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('Payment alredy exists');
  }
  public async checkPayment(): Promise<{
    user: UserEntity;
    status: PaymentStatus;
  }> {
    const { status } = await this.saga.rmqService.send<
      PaymentCheck.Request,
      PaymentCheck.Response
    >(PaymentCheck.topic, {
      userId: this.saga.user._id,
      courseId: this.saga.courseId,
    });

    if (status === 'canceled') {
      this.saga.setState(PurchasesState.Cancaled, this.saga.courseId);

      return { user: this.saga.user, status };
    }

    if (status !== 'success') {
      return { user: this.saga.user, status };
    }

    this.saga.setState(PurchasesState.Purchased, this.saga.courseId);

    return { user: this.saga.user, status };
  }
  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Error cancaled payment');
  }
}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('Course was bought');
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error('Course was bought');
  }
  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Course was bought');
  }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PurchasesState.Started, this.saga.courseId);

    return this.saga.getState().pay();
  }

  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error('Course was canceled');
  }

  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Course was canceled');
  }
}
