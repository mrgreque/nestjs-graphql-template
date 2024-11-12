import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Role } from '@/core/types';
import { Seed } from '@/core/@seedwork/domain/entity';

export default class UserSeed extends Seed {
  private constructor(dbConnection: mongoose.Connection, collectionName: string) {
    super(dbConnection, collectionName);
  }

  static create(dbConnection: mongoose.Connection) {
    return new UserSeed(dbConnection, 'users');
  }

  async seed() {
    await this.collection.insertMany([
      {
        _id: new ObjectId('111111111111111111111111'),
        email: 'admin@email.com',
        password: '$2b$12$5XOmj8WT7ViOPSfBaUIDBOB87PtTd/h7pyfg34IFIWuPFq1IX.Nxm', // 123456
        role: Role.ADMIN,
      },
      {
        _id: new ObjectId('222222222222222222222222'),
        email: 'user@email.com',
        password: '$2b$12$5XOmj8WT7ViOPSfBaUIDBOB87PtTd/h7pyfg34IFIWuPFq1IX.Nxm', // 123456
        role: Role.CLIENT,
      },
    ]);
  }
}
