import { UserRepository } from '@/application/repositories';
import { USER_REPOSITORY } from '@/core/contracts';
import { Role } from '@/core/types';
import { CreateUserUseCase } from '@/core/use-cases/user/create-user.use-case';
import { testHelpers } from '@/test/helpers';
import { testContext } from '@/test/test-context';

testContext('create user test', (resolver) => {
  let userRepository: UserRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeAll(() => {
    userRepository = resolver(USER_REPOSITORY);
    createUserUseCase = resolver(CreateUserUseCase);
  });

  describe('negative', () => {
    it('should not create the user if email is invalid', async () => {
      const response = await createUserUseCase.execute({
        email: 'a',
        password: 'testingout123',
        role: Role.USER,
      });

      expect(response).toEqual({ success: false, errorMessage: 'The provided email is not valid' });
    });

    it('should not create the user if password is invalid (short)', async () => {
      const password = testHelpers.random.string(4); // >= 6

      const response = await createUserUseCase.execute({
        email: 'john.doe@gmail.com',
        password: password,
        role: Role.USER,
      });

      expect(response).toEqual({ success: false, errorMessage: 'Password is too short' });
    });

    it('should not create the user if password is invalid (too long)', async () => {
      const password = testHelpers.random.string(33); // <= 32

      const response = await createUserUseCase.execute({
        email: 'john.doe@gmail.com',
        password: password,
        role: Role.USER,
      });

      expect(response).toEqual({ success: false, errorMessage: 'Password is too long' });
    });

    it('should not create the user if email already exists', async () => {
      const email = 'john.doe@gmail.com';
      const password = testHelpers.random.strongPassword();

      const createdUser = await createUserUseCase.execute({
        email,
        password,
        role: Role.USER,
      });

      expect(createdUser).toEqual({
        success: true,
        user: {
          email: 'john.doe@gmail.com',
          id: expect.any(String),
          password: expect.any(String),
          role: 'user',
          session: undefined,
        },
      });

      const response = await createUserUseCase.execute({
        email,
        password,
        role: Role.USER,
      });

      expect(response).toEqual({ success: false, errorMessage: 'User already exists' });
    });

    it('should not create the user if password is weak', async () => {
      const email = 'john.doe@gmail.com';
      const password = testHelpers.random.string(12);

      const response = await createUserUseCase.execute({
        email,
        password,
        role: Role.USER,
      });

      expect(response).toEqual({
        success: false,
        errorMessage:
          'Password is too weak. It must contain at least one uppercase letter, one lowercase letter, one number, one special character and must be at least 6 characters long.',
      });
    });
  });

  describe('positive', () => {
    it('should properly create the user', async () => {
      const email = 'john.doe@gmail.com';
      const password = testHelpers.random.strongPassword();

      const createdUser = await createUserUseCase.execute({
        email,
        password,
        role: Role.USER,
      });

      expect(createdUser).toEqual({
        success: true,
        user: {
          email: 'john.doe@gmail.com',
          id: expect.any(String),
          password: expect.any(String),
          role: 'user',
          session: undefined,
          deletedAt: undefined,
        },
      });

      const allUsers = await userRepository.findAll({ page: 0, limit: 10 });

      expect(allUsers.records).toBe(1);
      expect(allUsers.users[0].props.email).toBe(email);
    });
  });
});
