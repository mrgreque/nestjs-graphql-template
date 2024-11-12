import { UserRepository } from '@/application/repositories';
import { USER_REPOSITORY } from '@/core/contracts';
import { Role } from '@/core/types';
import { FindUsersUseCase } from '@/core/use-cases/user/find-users.use-case';
import { testHelpers } from '@/test/helpers';
import { testContext } from '@/test/test-context';
import { UserEntity } from '@/core/entites';

testContext('find user test', (resolver) => {
  let userRepository: UserRepository;
  let finUserByIdUseCase: FindUsersUseCase;

  beforeAll(() => {
    userRepository = resolver(USER_REPOSITORY);
    finUserByIdUseCase = resolver(FindUsersUseCase);
  });

  describe('positive', () => {
    it('should properly find users', async () => {
      const mockUser = [
        { email: 'test1@email.com', password: testHelpers.random.strongPassword() },
        { email: 'test2@email.com', password: testHelpers.random.strongPassword() },
      ];

      for (const user of mockUser) {
        const userEntity = UserEntity.create({ email: user.email, password: user.password, role: Role.USER });
        await userRepository.insert(userEntity);
      }

      const response = await finUserByIdUseCase.execute({ page: 1, limit: 10 });

      expect(response.records).toBe(2);
      expect(response.users).toHaveLength(2);
      expect(response.hasNext).toBe(false);
      expect(response.users[0]).toMatchObject({
        id: expect.any(String),
        email: mockUser[0].email,
        role: Role.USER,
      });

      const paginatedResponse = await finUserByIdUseCase.execute({ page: 1, limit: 1 });
      expect(paginatedResponse.records).toBe(2);
      expect(paginatedResponse.users).toHaveLength(1);
      expect(paginatedResponse.hasNext).toBe(true);
    });
  });

  it('should properly find users without items', async () => {
    const response = await finUserByIdUseCase.execute({ page: 1, limit: 10 });
    expect(response.records).toBe(0);
    expect(response).toEqual({
      records: 0,
      users: [],
      hasNext: false,
    });
  });
});
