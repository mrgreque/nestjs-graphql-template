import { UserRepository } from '@/application/repositories';
import { AuthService } from '@/application/services';
import { USER_REPOSITORY } from '@/core/contracts';
import { UserNotFoundError } from '@/core/errors';
import { LoginOrPasswordInvalidError } from '@/core/errors/session.error';
import { Inject, Injectable } from '@nestjs/common';

namespace Login {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output =
    | {
        token: string;
        refreshToken: string;
      }
    | {
        success: boolean;
        errorMessage?: string;
      };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute({ email, password }: Login.Input): Promise<Login.Output> {
    const user = await this.userRepository.findByEmail({ email });
    if (!user) throw new UserNotFoundError();

    const isValid = await this.authService.validateLogin({ user, password });
    if (!isValid) throw new LoginOrPasswordInvalidError();

    const tokens = this.authService.generateTokens(user);

    user.changeSessionToken(tokens);
    await this.userRepository.update(user);

    return tokens;
  }
}
