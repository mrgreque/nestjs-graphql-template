import { UserRepository } from '@/application/repositories';
import { USER_REPOSITORY } from '@/core/contracts';
import { UserEntity } from '@/core/entites';
import { Role } from '@/core/types';
import { UpdateUserUseCase } from '@/core/use-cases/user/update-user.use-case';
import { testHelpers } from '@/test/helpers';
import { testContext } from '@/test/test-context';

testContext('update user test', (resolver) => {
  let userRepository: UserRepository;
  let updateUserUseCase: UpdateUserUseCase;

  beforeAll(() => {
    userRepository = resolver(USER_REPOSITORY);
    updateUserUseCase = resolver(UpdateUserUseCase);
  });

  describe('negative', () => {
    it('should not update the user if email is invalid', async () => {
      const email = 'john.doe@gmail.com';
      const password = testHelpers.random.strongPassword();

      const user = UserEntity.create({ email, password, role: Role.USER });
      await userRepository.insert(user);

      const response = await updateUserUseCase.execute({
        id: user.id,
        email: 'a',
        password: password,
        role: Role.USER,
      });

      expect(response).toEqual({ success: false, errorMessage: 'The provided email is not valid' });
    });

    it('should not update the user if password is invalid (short)', async () => {
      const email = 'john.doe@gmail.com';
      const password = testHelpers.random.strongPassword();

      const user = UserEntity.create({ email, password, role: Role.USER });
      await userRepository.insert(user);

      const newPassword = testHelpers.random.string(4); // >= 6

      const response = await updateUserUseCase.execute({
        id: user.id,
        email: 'john.doe@gmail.com',
        password: newPassword,
        role: Role.USER,
      });

      expect(response).toEqual({ success: false, errorMessage: 'Password is too short' });
    });

    it('should not update the user if password is invalid (too long)', async () => {
      const email = 'john.doe@gmail.com';
      const password = testHelpers.random.strongPassword();

      const user = UserEntity.create({ email, password, role: Role.USER });
      await userRepository.insert(user);

      const newPassword = testHelpers.random.string(33); // <= 32

      const response = await updateUserUseCase.execute({
        id: user.id,
        email: 'john.doe@gmail.com',
        password: newPassword,
        role: Role.USER,
      });

      expect(response).toEqual({ success: false, errorMessage: 'Password is too long' });
    });

    it('should not update the user if password is weak', async () => {
      const email = 'john.doe@gmail.com';
      const password = testHelpers.random.strongPassword();

      const user = UserEntity.create({ email, password, role: Role.USER });
      await userRepository.insert(user);

      const newPassword = testHelpers.random.string(12);

      const response = await updateUserUseCase.execute({
        id: user.id,
        email,
        password: newPassword,
        role: Role.USER,
      });

      expect(response).toEqual({
        success: false,
        errorMessage:
          'Password is too weak. It must contain at least one uppercase letter, one lowercase letter, one number, one special character and must be at least 6 characters long.',
      });
    });

    it('should not update if user does not exist', async () => {
      const email = 'john.doe@gmail.com';
      const password = testHelpers.random.strongPassword();

      const response = await updateUserUseCase.execute({
        id: testHelpers.random.objectId(),
        email,
        password,
        role: Role.USER,
      });

      expect(response).toEqual({ success: false, errorMessage: 'User not found' });
    });

    it('should not update the user if email already taken', async () => {
      const email = 'john.doe@gmail.com';
      const newEmail = 'john.doe2@gmail.com';
      const password = testHelpers.random.strongPassword();

      const user = UserEntity.create({ email, password, role: Role.USER });
      await userRepository.insert(user);

      const secondUser = UserEntity.create({ email: newEmail, password, role: Role.USER });
      await userRepository.insert(secondUser);

      const response = await updateUserUseCase.execute({
        id: user.id,
        email: newEmail,
        password,
        role: Role.ADMIN,
      });

      expect(response).toEqual({ success: false, errorMessage: 'Email already taken' });
    });
  });

  describe('positive', () => {
    it('should properly update the user', async () => {
      const email = 'john.doe@gmail.com';
      const password = testHelpers.random.strongPassword();

      const user = UserEntity.create({ email, password, role: Role.USER });
      await userRepository.insert(user);

      const savedUser = await userRepository.findByEmail({ email });
      const lastPassword = savedUser.props.password;

      const newEmail = 'john.doe2@gmail.com';
      const response = await updateUserUseCase.execute({
        id: user.id,
        email: newEmail,
        password,
        role: Role.ADMIN,
      });

      expect(response).toMatchObject({
        success: true,
        user: {
          email: 'john.doe2@gmail.com',
          id: expect.any(String),
          password: expect.any(String),
          role: 'admin',
        },
      });

      expect(response.user.password).not.toEqual(lastPassword);
    });
  });
});
