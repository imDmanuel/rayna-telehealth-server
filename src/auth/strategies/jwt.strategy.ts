// src/auth/jwt.strategy.ts
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/lib/constants';
import { JwtPayload } from '../auth.interfaces';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { ErrorResponse } from 'src/lib/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly drizzleService: DrizzleService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_SECRET),
    });
  }

  async validate(payload: JwtPayload) {
    const authDetails = await this.drizzleService.db.query.authTable.findFirst({
      where: (auth, { eq }) => eq(auth.userId, payload.sub),
    });

    if (!authDetails) {
      throw new UnauthorizedException({
        reason: 'unauthenticated',
        message: 'Unauthenticated access, please login',
      });
    }

    if (!authDetails.emailVerified) {
      throw new ForbiddenException({
        reason: 'email-unverified',
        message: 'Your email has not been verified',
      } as ErrorResponse);
    }
    return { userId: payload.sub, email: payload.email };
  }
}
