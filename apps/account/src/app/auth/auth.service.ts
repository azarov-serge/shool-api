import { Injectable } from '@nestjs/common';
import { RegisterDto } from './auth.controller';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entites/user.entity';
import { UserRole } from '@school/interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async register({ email, password, displayName }: RegisterDto) {
    const oldUser = await this.userRepository.findUserByEmail(email);

    if (oldUser) {
      throw Error(`User with email: ${email} exist`);
    }

    const newUserEntity = await new UserEntity({
      email,
      displayName,
      passwordHash: '',
      role: UserRole.Student,
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);

    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw Error('Invalid email or password');
    }

    const userEntity = new UserEntity(user);

    const isValidPassword = await userEntity.validatePassword(password);

    if (!isValidPassword) {
      throw Error('Invalid email or password');
    }

    return { id: user._id };
  }

  async login(id: string) {
    return {
      acess_token: await this.jwtService.signAsync({ id }),
    };
  }
}
