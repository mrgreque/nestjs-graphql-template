export class MissingRequiredFieldsError extends Error {
  constructor(message?: string) {
    super(message || 'Required fields are missing');
    this.name = 'MissingRequiredFieldsError';
  }
}
