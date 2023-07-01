import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { AuthController } from './controllers/auth.controller';
import { getRmqConfig } from './configs/rmq.config';
import { getJwtConfig } from './configs/jwt.config';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
    RMQModule.forRootAsync(getRmqConfig()),
    JwtModule.registerAsync(getJwtConfig()),
    PassportModule,
  ],
  controllers: [AuthController, UserController],
})
export class AppModule {}
