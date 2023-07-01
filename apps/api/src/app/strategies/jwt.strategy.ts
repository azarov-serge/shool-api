import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IJwtPayload } from '@school/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configServise: ConfigService) {
    super({
      jwtFromReqest: ExtractJwt.fromAuthHeaderAsBearerToken,
      ignoreExpiration: true,
      secretOrKEy: configServise.get('JWT_SECRET'),
    });
  }

  async validate({ id }: IJwtPayload) {
    return id;
  }
}
