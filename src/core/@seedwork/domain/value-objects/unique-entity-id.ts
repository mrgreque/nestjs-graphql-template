import mongoose from 'mongoose';
import InvalidObjectIdError from '../errors/invalid-object-id.error';
import { ValueObject } from './value-object';

export class UniqueEntityId extends ValueObject<string> {
  constructor(id?: string) {
    super(id || new mongoose.Types.ObjectId().toString());
    this.validate();
  }

  validate() {
    const isValid = mongoose.Types.ObjectId.isValid(this.value);
    if (!isValid) {
      throw new InvalidObjectIdError();
    }
  }
}

export default UniqueEntityId;
