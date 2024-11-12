import { UserRepository } from '@/application/repositories';
import { USER_REPOSITORY } from '@/core/contracts';
import { Role } from '@/core/types';
import { DeleteUserUseCase } from '@/core/use-cases/user/delete-user.use-case';
import { testHelpers } from '@/test/helpers';
import { testContext } from '@/test/test-context';
import { UserEntity } from '@/core/entites';

testContext('delete user test', (resolver) => {
  let userRepository: UserRepository;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeAll(() => {
    userRepository = resolver(USER_REPOSITORY);
    deleteUserUseCase = resolver(DeleteUserUseCase);
  });

  describe('negative', () => {
    it('should not delete the user if user does not exist', async () => {
      const response = await deleteUserUseCase.execute({ id: testHelpers.random.objectId() });

      expect(response.success).toBe(false);
      expect(response.errorMessage).toBe('User not found');
    });
  });

  describe('positive', () => {
    it('should properly delete user', async () => {
      const email = 'john.doe@gmail.com';
      const password = testHelpers.random.strongPassword();

      const user = UserEntity.create({ email, password, role: Role.USER });
      await userRepository.insert(user);

      const foundUser = await userRepository.findById({ id: user.id });
      expect(foundUser).toMatchObject({
        id: user.id,
        props: {
          email,
          password,
          session: undefined,
          role: 'user',
        },
      });

      const response = await deleteUserUseCase.execute({ id: user.id });

      expect(response.success).toBe(true);

      const deletedUser = await userRepository.findById({ id: user.id });
      expect(deletedUser).toBeUndefined();
    });
  });
});
