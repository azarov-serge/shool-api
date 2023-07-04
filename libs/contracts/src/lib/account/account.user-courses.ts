import { IUserCourse } from '@school/interfaces';
import { IsString } from 'class-validator';

export namespace AccountUserCourses {
  export const topic = 'account.user-courses.command';

  export class Request {
    @IsString()
    id: string;
  }

  export class Response {
    courses: IUserCourse[];
  }
}
