import { UserRepository } from '@/application/repositories';
import { CryptService } from '@/application/services';
import { USER_REPOSITORY } from '@/core/contracts';
import { UserEntity } from '@/core/entites';
import { IUser, Role } from '@/core/types';
import { testHelpers } from '@/test/helpers';
import { EntityCreator } from '@/test/types';

export const createUser: EntityCreator<IUser, UserEntity | null> = async (resolver, properties = {}) => {
  const attributes = Object.assign({}, properties);

  const userRepository: UserRepository = resolver(USER_REPOSITORY);
  const cryptService: CryptService = resolver(CryptService);

  const payload: IUser = {
    email: testHelpers.random.email(),
    password: testHelpers.random.string(12),
    role: Role.CLIENT,
    ...attributes,
  };

  const user = UserEntity.create(payload);

  const hashed = await cryptService.hash(payload.password);
  const updatedUser = user.update({ password: hashed });

  await userRepository.insert(updatedUser);
  const result = await userRepository.findByEmail({ email: payload.email });

  return result;
};
