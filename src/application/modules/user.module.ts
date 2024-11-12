import { Module } from '@nestjs/common';
import { UserResolver } from '@/application/resolvers';
import { UserRepository } from '@/application/repositories';
import { USER_REPOSITORY } from '@/core/contracts';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/application/mongoose';
import { CreateUserUseCase, FindUserByIdUseCase, FindUsersUseCase, UpdateUserUseCase } from '@/core/use-cases';
import { CryptService, UserService } from '@/application/services';
import { DeleteUserUseCase } from '@/core/use-cases/user/delete-user.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    CryptService,
    UserService,
    UserResolver,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    UserRepository,
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
