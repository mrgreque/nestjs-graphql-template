import { User } from '@/application/dtos';
import { CryptService, UserService } from '@/application/services';
import { IUserRepository, USER_REPOSITORY } from '@/core/contracts';
import { UserEntity } from '@/core/entites';
import { Role } from '@/core/types';
import { EmailAlreadyTakenError, UserNotFoundError } from '@/core/errors';
import { Inject, Injectable } from '@nestjs/common';

namespace UpdateUser {
  export type Input = {
    id: string;
    email?: string;
    password?: string;
    role?: Role;
  };

  export type Output = {
    success: boolean;
    user?: User;
    errorMessage?: string;
  };
}

@Injectable()
export class UpdateUserUseCase {
  private user: UserEntity;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly cryptService: CryptService,
    private readonly userService: UserService,
  ) {}

  async execute(input: UpdateUser.Input): Promise<UpdateUser.Output> {
    try {
      const existingUser = await this.userRepository.findById({ id: input.id });
      if (!existingUser) throw new UserNotFoundError();
      this.user = existingUser;
      delete input.id;

      if (input.email && this.user.props.email !== input.email) {
        await this.validateEmail(input.email);
        if (!input.password) this.user.validateEmail();
      }

      if (input.password) {
        const hashedPassword = await this.validatePassword(input.password);
        input.password = hashedPassword;
      }

      // update user and remove session
      const updatedUser = this.user.update({ ...input, session: null });

      await this.userRepository.update(updatedUser);
      return { success: true, user: this.userService.toDto(updatedUser) };
    } catch (error) {
      return { success: false, errorMessage: error.message };
    }
  }

  private async validateEmail(email: string) {
    const userByEmail = await this.userRepository.findByEmail({ email });
    if (userByEmail) throw new EmailAlreadyTakenError();
    this.user.props.email = email;
  }

  private async validatePassword(password: string) {
    this.user.props.password = password;
    this.user.validate();
    const hashedPassword = await this.cryptService.hash(password);
    return hashedPassword;
  }
}
