import { env } from '@/core/config/env';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repositories';
import { USER_REPOSITORY } from '@/core/contracts';
import { UserAuthFromInexistentUserError, UserUnauthorizedError } from '@/core/errors/session.error';
import { Role } from '@/core/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findById({ id: payload.sub });

    if (!user) throw new UserAuthFromInexistentUserError();
    if (user.props.role !== Role.ADMIN) throw new UserUnauthorizedError();

    return { userId: payload.sub };
  }
}
