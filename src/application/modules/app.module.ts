import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from '@/core/config/env';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/application/middlewares';
import { USER_REPOSITORY } from '@/core/contracts';
import { UserModule } from '@/application/modules/user.module';
import { SessionModule } from '@/application/modules/session.module';
import { GraphQLFederationModule } from '@/application/modules/graphql.module';
import { ApplicationModule } from '@/application/modules/application.module';
import { UserRepository } from '@/application/repositories';

export const modules = [UserModule, SessionModule, GraphQLFederationModule, ApplicationModule];

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [UserModule],
      useFactory: async (_: UserRepository) => ({
        secret: env.JWT_SECRET,
      }),
      inject: [USER_REPOSITORY],
    }),
    MongooseModule.forRoot(env.MONGO_DB_CONNECTION_STRING),
    ...modules,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
