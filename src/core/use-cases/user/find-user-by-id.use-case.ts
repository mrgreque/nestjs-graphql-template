import { User } from '@/application/dtos';
import { UserService } from '@/application/services';
import { IUserRepository, USER_REPOSITORY } from '@/core/contracts';
import { UserNotFoundError } from '@/core/errors';
import { Inject, Injectable } from '@nestjs/common';

namespace UpdateUser {
  export type Input = {
    id: string;
  };

  export type Output = User;
}

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly userService: UserService,
  ) {}
  async execute(input: UpdateUser.Input): Promise<UpdateUser.Output> {
    const user = await this.userRepository.findById({ id: input.id });
    if (!user) throw new UserNotFoundError();

    return this.userService.toDto(user);
  }
}
