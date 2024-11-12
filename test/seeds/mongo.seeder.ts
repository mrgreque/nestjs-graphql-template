import mongoose from 'mongoose';
import { mongoInstance } from '../mocks/app-module';
import UserSeed from './mongo/user';
import ApplicationSeed from './mongo/application';

const seeds = {
  users: UserSeed,
  applications: ApplicationSeed,
};

const prepareMongoDb = async (connection: mongoose.Connection) => {
  await Promise.all(
    Object.keys(seeds).map(async (key) => {
      const seed = seeds[key as keyof typeof seeds];
      const instance = seed.create(connection);
      await instance.seed();
    }),
  );
};

const seedMongoDb = async () => {
  const uri = mongoInstance.getUri();
  const connection = await mongoose.createConnection(uri).asPromise();

  await prepareMongoDb(connection);
};

export { seedMongoDb };
