import { Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import { JwtAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly configService: ConfigService) {}

  @UseGuards(JwtAuthGuard)
  @Post('info')
  async info(@UserId() userId: string) {
    await new Promise((res) => {
      setTimeout(res, 200);
    });
  }

  @Cron('*/5 * * * * *')
  async cron() {
    Logger.log('Cron done');
  }
}
