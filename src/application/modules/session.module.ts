import { Module } from '@nestjs/common';
import { UserRepository } from '@/application/repositories';
import { USER_REPOSITORY } from '@/core/contracts';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/application/mongoose';
import { LoginUseCase, RefreshTokenUseCase } from '@/core/use-cases';
import { AuthService, CryptService, JwtService } from '@/application/services';
import { SessionResolver } from '../resolvers';

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
    SessionResolver,
    AuthService,
    JwtService,
    CryptService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    LoginUseCase,
    RefreshTokenUseCase,
  ],
})
export class SessionModule {}
