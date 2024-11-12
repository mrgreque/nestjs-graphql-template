import { JwtStrategy } from '@/application/middlewares';
import { modules } from '@/application/modules/app.module';
import { UserModule } from '@/application/modules/user.module';
import { UserRepository } from '@/application/repositories';
import { env } from '@/core/config/env';
import { USER_REPOSITORY } from '@/core/contracts';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoInstance: MongoMemoryServer;

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
    MongooseModule.forRootAsync({
      useFactory: async (): Promise<MongooseModuleOptions> => {
        mongoInstance = await MongoMemoryServer.create();
        const uri = mongoInstance.getUri();

        return {
          uri,
        };
      },
    }),
    ...modules,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
class TestingModule {}

export const AppModuleMock = Test.createTestingModule({
  imports: [TestingModule],
});

export { mongoInstance };
