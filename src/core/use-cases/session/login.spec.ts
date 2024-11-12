import { UserNotFoundError } from '@/core/errors';
import { LoginUseCase } from '@/core/use-cases/session/login.use-case';
import { createUser } from '@/test/helpers';
import { testHelpers } from '@/test/helpers';
import { testContext } from '@/test/test-context';

testContext('login test', (resolver) => {
  let loginUseCase: LoginUseCase;

  beforeAll(() => {
    loginUseCase = resolver(LoginUseCase);
  });

  describe('negative', () => {
    it('should not login because account does not exist', async () => {
      const password = testHelpers.random.string(8);

      const response = loginUseCase.execute({
        email: 'john.doe@gmail.com',
        password,
      });

      await expect(response).rejects.toThrow(UserNotFoundError);
    });

    it('should not login because password is not matching', async () => {
      const password = testHelpers.random.string(8);
      const email = testHelpers.random.email();

      await createUser(resolver, { password, email });

      const response = loginUseCase.execute({
        email,
        password: testHelpers.random.string(10),
      });

      await expect(response).rejects.toThrow('Login or password is invalid');
    });
  });

  describe('positive', () => {
    it('should login properly given that the data is correct', async () => {
      const password = testHelpers.random.string(8);
      const email = testHelpers.random.email();

      await createUser(resolver, { password, email });

      const response = await loginUseCase.execute({
        email,
        password,
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
