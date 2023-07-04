export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
}

export enum PurchasesState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Cancaled = 'Cancaled',
}

export interface IUserCourse {
  _id?: string;
  courseId: string;
  purchasesState: PurchasesState;
}

export interface IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourse[];
}
