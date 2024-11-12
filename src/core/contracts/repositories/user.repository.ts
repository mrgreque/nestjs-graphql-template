import { UserEntity } from '@/core/entites';

export const USER_REPOSITORY = Symbol('UserRepository');

export namespace FindUserById {
  export type Input = {
    id: string;
  };
  export type Output = UserEntity;
}

export namespace FindUser {
  export type Input = {
    page: number;
    limit: number;
  };
  export type Output = {
    records: number;
    hasNext: boolean;
    users: UserEntity[];
  };
}

export namespace CreateUser {
  export type Input = UserEntity;
  export type Output = void;
}

export namespace UpdateUser {
  export type Input = UserEntity;
  export type Output = void;
}

export namespace FindUserByEmail {
  export type Input = {
    email: string;
  };
  export type Output = UserEntity | null;
}

export namespace DeleteUser {
  export type Input = {
    id: string;
  };
  export type Output = void;
}

export interface IUserRepository {
  findById(input: FindUserById.Input): Promise<FindUserById.Output>;
  findAll(pagination?: FindUser.Input): Promise<FindUser.Output>;
  insert(user: CreateUser.Input): Promise<CreateUser.Output>;
  update(user: UpdateUser.Input): Promise<UpdateUser.Output>;
  findByEmail(email: FindUserByEmail.Input): Promise<FindUserByEmail.Output>;
  delete(input: DeleteUser.Input): Promise<DeleteUser.Output>;
}
