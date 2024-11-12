import { TestingModule } from '@nestjs/testing';
import { NestApplication } from '@nestjs/core';
import { TestContext } from '@/test/types';
import { AppModuleMock, mongoInstance } from '@/test/mocks/app-module';
import { ModuleResolver } from '@/test/types';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

let app: NestApplication;

export const testContext: TestContext = (name, testsFn, options = {}) => {
  const defaultOptions = {
    restoreDatabase: true,
    restoreCache: true,
    restoreEnv: true,
  };

  options = { ...defaultOptions, ...options };

  describe(name, function () {
    let moduleRef: TestingModule;
    let copyEnv: Record<string, string>;
    let connection: Connection;

    beforeAll(async () => {
      process.env.MODE = 'test';
      copyEnv = { ...process.env };

      moduleRef = await AppModuleMock.compile();
      app = moduleRef.createNestApplication();

      connection = moduleRef.get<Connection>(getConnectionToken());

      await app.init();
    });

    afterEach(async () => {
      // to do: cache.clear();
      if (options.restoreDatabase) await connection.dropDatabase();
      if (options.restoreEnv) process.env = copyEnv;
    });

    afterAll(async () => {
      // to do: cache.clear();
      if (!options.restoreDatabase) await connection.dropDatabase();
      process.env = copyEnv;
      if (mongoInstance) await mongoInstance.stop();
      await app.close();
    });

    const moduleResolver: ModuleResolver = (moduleClass) => moduleRef.get(moduleClass);

    testsFn(moduleResolver);
  });
};

export { app };
