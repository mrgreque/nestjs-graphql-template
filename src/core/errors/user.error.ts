export class UserAlreadyExistsError extends Error {
  constructor(message?: string) {
    super(message || 'User already exists');
    this.name = 'UserAlreadyExistsError';
  }
}

export class UserNotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'User not found');
    this.name = 'UserNotFoundError';
  }
}

export class EmailAlreadyTakenError extends Error {
  constructor(message?: string) {
    super(message || 'Email already taken');
    this.name = 'EmailAlreadyTakenError';
  }
}
