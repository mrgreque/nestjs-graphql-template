import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

export const env = {
  MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
  JWT_SECRET: process.env.JWT_SECRET,
};
