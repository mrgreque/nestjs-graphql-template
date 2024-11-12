export default class InvalidObjectIdError extends Error {
  constructor(message?: string) {
    super(message || 'ID must be a valid ObjectID');
    this.name = 'InvalidObjectIdError';
  }
}
