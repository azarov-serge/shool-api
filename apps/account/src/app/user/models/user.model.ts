import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  IUser,
  IUserCourse,
  PurchasesState,
  UserRole,
} from '@school/interfaces';

@Schema()
export class UserCorse extends Document implements IUserCourse {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true, enum: PurchasesState, type: String })
  purchasesState: PurchasesState;
}

export const UserCorseSchema = SchemaFactory.createForClass(UserCorse);

@Schema()
export class User extends Document implements IUser {
  @Prop()
  displayName?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    required: true,
    enum: UserRole,
    type: String,
    default: UserRole.Student,
  })
  role: UserRole;

  @Prop({ type: [UserCorseSchema], _id: false })
  courses: Types.Array<UserCorse>;
}

export const UserSchema = SchemaFactory.createForClass(User);
