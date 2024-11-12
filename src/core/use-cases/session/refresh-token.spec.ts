import { AuthService, JwtService } from '@/application/services';
import { UserEntity } from '@/core/entites';
import { Role } from '@/core/types';
import { UserNotFoundError } from '@/core/errors';
import { ExpiredRefreshTokenError } from '@/core/errors/session.error';
import { RefreshTokenUseCase } from '@/core/use-cases/session/refresh-token.use-case';
import { createUser } from '@/test/helpers';
import { testHelpers } from '@/test/helpers';
import { testContext } from '@/test/test-context';
import mongoose from 'mongoose';

testContext('refresh token test', (resolver) => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let jwtService: JwtService<{ sub: string }>;
  let authService: AuthService;

  beforeAll(() => {
    refreshTokenUseCase = resolver(RefreshTokenUseCase);
    jwtService = resolver(JwtService);
    authService = resolver(AuthService);
  });

  describe('negative', () => {
    it('should not refresh because token is not valid', async () => {
      const response = refreshTokenUseCase.execute({
        token: testHelpers.random.string(32),
      });

      await expect(response).rejects.toThrow(ExpiredRefreshTokenError);
    });

    it('should not refresh because token is expired', async () => {
      const user = await createUser(resolver);
      const payload = { sub: user.id };
      const refreshToken = jwtService.sign(payload, '1s');

      await new Promise((r) => setTimeout(r, 1500));

      const response = refreshTokenUseCase.execute({
        token: refreshToken,
      });

      await expect(response).rejects.toThrow(ExpiredRefreshTokenError);
    });

    it('should not refresh because token is not valid', async () => {
      const user = UserEntity.restore({
        email: testHelpers.random.email(),
        password: testHelpers.random.string(12),
        role: Role.ADMIN,
        id: new mongoose.Types.ObjectId().toString(),
      });

      const currentTokens = authService.generateTokens(user);

      const response = refreshTokenUseCase.execute({
        token: currentTokens.refreshToken,
      });

      await expect(response).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('positive', () => {
    it('should properly refresh the tokens', async () => {
      const user = await createUser(resolver);
      const currentTokens = authService.generateTokens(user);
      expect(currentTokens).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );

      const response = await refreshTokenUseCase.execute({
        token: currentTokens.refreshToken,
      });

      expect(response).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );
    });
  });
});
