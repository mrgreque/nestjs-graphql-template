import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserUseCase, FindUserByIdUseCase, FindUsersUseCase, UpdateUserUseCase } from '@/core/use-cases';
import {
  CreateUserResponse,
  CreateUserInput,
  UpdateUserInput,
  ByIdInput,
  DefaultOperationResponse,
  User,
  UserPagination,
  DefaultPaginationInput,
} from '@/application/dtos';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/application/guards';
import { CurrentUser } from '@/application/decorator';
import { DeleteUserUseCase } from '@/core/use-cases/user/delete-user.use-case';

@Resolver()
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CreateUserResponse)
  async createUser(
    @Args('data')
    user: CreateUserInput,
    // I'm adding this decorator to get the user id from the token
    // the idea is to use this id to create temp logs in the future to track the user actions
    @CurrentUser() actionUser: { userId: string },
  ): Promise<CreateUserResponse> {
    // Temporary log to track the user actions
    const logger = new Logger();
    logger.log(`User ${actionUser.userId} is creating a new user`);

    return await this.createUserUseCase.execute(user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async user(
    @Args()
    id: ByIdInput,
  ): Promise<User> {
    return await this.findUserByIdUseCase.execute(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserPagination)
  async users(
    @Args('pagination')
    pagination: DefaultPaginationInput,
  ): Promise<UserPagination> {
    return await this.findUsersUseCase.execute(pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CreateUserResponse)
  async updateUser(
    @Args('data')
    user: UpdateUserInput,
  ): Promise<CreateUserResponse> {
    return await this.updateUserUseCase.execute(user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => DefaultOperationResponse)
  async deleteUser(
    @Args()
    id: ByIdInput,
  ): Promise<DefaultOperationResponse> {
    return await this.deleteUserUseCase.execute(id);
  }
}
