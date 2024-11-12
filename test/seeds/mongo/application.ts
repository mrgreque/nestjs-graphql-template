import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Seed } from '@/core/@seedwork/domain/entity';

export default class ApplicationSeed extends Seed {
  private constructor(dbConnection: mongoose.Connection, collectionName: string) {
    super(dbConnection, collectionName);
  }

  static create(dbConnection: mongoose.Connection) {
    return new ApplicationSeed(dbConnection, 'applications');
  }

  async seed() {
    await this.collection.insertMany([
      {
        _id: new ObjectId('111111111111111111111111'),
        name: 'Test Application',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        deletedAt: null,
      },
    ]);
  }
}
