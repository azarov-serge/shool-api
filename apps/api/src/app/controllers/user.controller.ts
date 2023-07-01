import { Controller, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
}
