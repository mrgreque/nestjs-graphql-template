import { UserRepository } from '@/application/repositories';
import { USER_REPOSITORY } from '@/core/contracts';
import { Role } from '@/core/types';
import { FindUserByIdUseCase } from '@/core/use-cases/user/find-user-by-id.use-case';
import { testHelpers } from '@/test/helpers';
import { testContext } from '@/test/test-context';
import { UserEntity } from '@/core/entites';
import { UserNotFoundError } from '@/core/errors';

testContext('find user test', (resolver) => {
  let userRepository: UserRepository;
  let finUserByIdUseCase: FindUserByIdUseCase;

  beforeAll(() => {
    userRepository = resolver(USER_REPOSITORY);
    finUserByIdUseCase = resolver(FindUserByIdUseCase);
  });

  describe('negative', () => {
    it('should not find the user if user does not exist', async () => {
      const response = finUserByIdUseCase.execute({ id: testHelpers.random.objectId() });

      await expect(response).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('positive', () => {
    it('should properly find user', async () => {
      const email = 'john.doe@gmail.com';
      const password = testHelpers.random.strongPassword();

      const user = UserEntity.create({ email, password, role: Role.USER });
      await userRepository.insert(user);

      const response = await finUserByIdUseCase.execute({ id: user.id });

      expect(response).toMatchObject({
        id: expect.any(String),
        email: user.props.email,
        role: user.props.role,
      });
    });
  });
});
