import mongoose from 'mongoose';

export abstract class Seed {
  public connection: mongoose.Connection;
  public collection: mongoose.Collection;

  constructor(dbConnection: mongoose.Connection, collectionName: string) {
    this.collection = dbConnection.collection(collectionName);
  }
}
