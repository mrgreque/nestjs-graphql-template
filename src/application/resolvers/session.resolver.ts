import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginInput, RefreshTokenInput, TokenResponse } from '@/application/dtos';
import { LoginUseCase, RefreshTokenUseCase } from '@/core/use-cases';

@Resolver()
export class SessionResolver {
  constructor(private readonly loginUseCase: LoginUseCase, private readonly refreshTokenUsecase: RefreshTokenUseCase) {}

  @Mutation(() => TokenResponse)
  async login(
    @Args()
    email: LoginInput,
  ): Promise<TokenResponse> {
    return (await this.loginUseCase.execute(email)) as TokenResponse;
  }

  @Mutation(() => TokenResponse)
  async refreshToken(
    @Args()
    input: RefreshTokenInput,
  ): Promise<TokenResponse> {
    return await this.refreshTokenUsecase.execute(input);
  }
}
