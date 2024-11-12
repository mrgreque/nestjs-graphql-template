import { User } from '@/application/dtos';
import { UserService } from '@/application/services';
import { IUserRepository, USER_REPOSITORY } from '@/core/contracts';
import { Inject, Injectable } from '@nestjs/common';

namespace FindUser {
  export type Input = {
    page: number;
    limit: number;
  };

  export type Output = {
    records: number;
    hasNext: boolean;
    users: User[];
  };
}

@Injectable()
export class FindUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly userService: UserService,
  ) {}
  async execute(input: FindUser.Input): Promise<FindUser.Output> {
    const result = await this.userRepository.findAll({ page: input.page - 1, limit: input.limit });
    const formattedUsers = result.users.map((user) => this.userService.toDto(user));
    return { ...result, users: formattedUsers };
  }
}
