import { UserRepository } from '@/application/repositories';
import { AuthService } from '@/application/services';
import { USER_REPOSITORY } from '@/core/contracts';
import { UserNotFoundError } from '@/core/errors';
import { Inject, Injectable } from '@nestjs/common';

namespace RefreshToken {
  export type Input = {
    token: string;
  };

  export type Output = {
    token: string;
    refreshToken: string;
  };
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute({ token }: RefreshToken.Input): Promise<RefreshToken.Output> {
    const { userId: id } = this.authService.verifyRefreshToken({ token });

    const user = await this.userRepository.findById({ id });
    if (!user) throw new UserNotFoundError();

    const tokens = this.authService.generateTokens(user);

    user.changeSessionToken(tokens);
    await this.userRepository.update(user);

    return tokens;
  }
}
