import { ObjectId } from 'bson';
import * as bcrypt from 'bcrypt';

export const testHelpers = {
  random: {
    string: (length: number) => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let result = '';

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      }

      return result;
    },
    email: () => {
      return `${testHelpers.random.string(10)}@test.com`;
    },
    strongPassword: () => {
      return `${testHelpers.random.string(10)}Aa@1`;
    },
    objectId: () => {
      return new ObjectId().toHexString();
    },
  },
  crypt: (password: string) => {
    return bcrypt.hash(password, 12);
  },
};
