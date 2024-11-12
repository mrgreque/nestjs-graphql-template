import { UserEntity } from '@/core/entites';
import { User } from '@/application/dtos';
import { IEntityService } from '@/core/contracts';
import { entityToDto } from '@/core/helpers';
import { IUser } from '@/core/types';

export class UserService implements IEntityService<UserEntity, User> {
  toDto(user: UserEntity): User {
    return entityToDto<IUser, User>(user);
  }
}
