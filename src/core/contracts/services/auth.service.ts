import { UserEntity } from '@/core/entites';

export namespace ValidateLogin {
  export type Input = {
    password: string;
    user: UserEntity;
  };
  export type Output = boolean;
}

export namespace GenerateTokens {
  export type Input = UserEntity;

  export type Output = {
    token: string;
    refreshToken: string;
  };
}

export namespace Verify {
  export type Input = {
    token: string;
  };

  export type Output = {
    userId: string;
  };
}

export namespace VerifyRefreshToken {
  export type Input = {
    token: string;
  };
  export type Output = { userId: string };
}

export interface IAuthService {
  validateLogin(input: ValidateLogin.Input): Promise<ValidateLogin.Output>;
  generateTokens(user: GenerateTokens.Input): GenerateTokens.Output;
  verifyRefreshToken(input: VerifyRefreshToken.Input): VerifyRefreshToken.Output;
}
