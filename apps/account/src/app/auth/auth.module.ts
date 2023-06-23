import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { getJwtConfig } from '../config/jwt.config';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, JwtModule.registerAsync(getJwtConfig())],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
