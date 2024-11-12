import { IUserRepository, USER_REPOSITORY } from '@/core/contracts';
import { UserNotFoundError } from '@/core/errors';
import { Inject, Injectable } from '@nestjs/common';

namespace DeleteUser {
  export type Input = {
    id: string;
  };

  export type Output = {
    success: boolean;
    errorMessage?: string;
  };
}

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: DeleteUser.Input): Promise<DeleteUser.Output> {
    try {
      const existingUser = await this.userRepository.findById({ id: input.id });
      if (!existingUser) throw new UserNotFoundError();

      await this.userRepository.delete({ id: input.id });

      return { success: true };
    } catch (error) {
      return { success: false, errorMessage: error.message };
    }
  }
}
