import { AccountChangedCourse } from '@school/contracts';
import {
  IDomainEvent,
  IUser,
  IUserCourse,
  PurchasesState,
  UserRole,
} from '@school/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses: IUserCourse[];
  events: IDomainEvent[] = [];

  constructor(user: IUser) {
    this._id = user._id;
    this.displayName = user.displayName;
    this.email = user.email;
    this.passwordHash = user.passwordHash;
    this.role = user.role;
    this.courses = user.courses || [];
  }

  public async getPublicProfile() {
    return {
      email: this.email,
      displayName: this.displayName,
      role: this.role,
    };
  }

  public setCourseStatus(courseId: string, state: PurchasesState) {
    const exist = Boolean(
      this.courses.find((course) => course.courseId === courseId)
    );

    if (!exist) {
      const course: IUserCourse = {
        courseId,
        purchasesState: state,
      };

      this.courses.push(course);
      return this;
    }

    if (state === PurchasesState.Cancaled) {
      this.courses = this.courses.filter(
        (course) => course.courseId !== courseId
      );

      return this;
    }

    this.courses = this.courses.map((course) => {
      if (course.courseId === courseId) {
        course.purchasesState = state;
        return course;
      }

      return course;
    });

    this.events.push({
      topic: AccountChangedCourse.topic,
      data: { courseId, userId: this._id, state },
    });

    return this;
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);

    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName;

    return this;
  }

  public getCourseState(courseId: string): PurchasesState {
    const course = this.courses.find((item) => item.courseId === courseId);

    if (!course) {
      return PurchasesState.Started;
    }

    return course.purchasesState;
  }
}
