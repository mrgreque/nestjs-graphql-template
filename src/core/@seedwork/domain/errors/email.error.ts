export class InvalidEmailError extends Error {
  constructor(message?: string) {
    super(message || 'The provided email is not valid');
    this.name = 'InvalidEmailError';
  }
}
