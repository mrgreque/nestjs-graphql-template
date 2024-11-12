import { User } from '@/application/dtos';
import { CryptService, UserService } from '@/application/services';
import { IUserRepository, USER_REPOSITORY } from '@/core/contracts';
import { UserEntity } from '@/core/entites';
import { Role } from '@/core/types';
import { UserAlreadyExistsError } from '@/core/errors';
import { Inject, Injectable } from '@nestjs/common';

namespace CreateUser {
  export type Input = {
    email: string;
    password: string;
    role: Role;
  };

  export type Output = {
    success: boolean;
    user?: User;
    errorMessage?: string;
  };
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly cryptService: CryptService,
    private readonly userService: UserService,
  ) {}
  async execute(input: CreateUser.Input): Promise<CreateUser.Output> {
    try {
      const user = UserEntity.create(input);
      user.validate();

      const existingUser = await this.userRepository.findByEmail({ email: user.props.email });
      if (existingUser) throw new UserAlreadyExistsError();

      const hashedPassword = await this.cryptService.hash(user.props.password);
      const updatedUser = user.update({ password: hashedPassword });

      await this.userRepository.insert(updatedUser);
      return { success: true, user: this.userService.toDto(updatedUser) };
    } catch (error) {
      return { success: false, errorMessage: error.message };
    }
  }
}
