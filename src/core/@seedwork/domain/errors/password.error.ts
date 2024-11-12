export class PasswordTooShortError extends Error {
  constructor(message?: string) {
    super(message || 'Password is too short');
    this.name = 'PasswordTooShortError';
  }
}

export class PasswordTooLongError extends Error {
  constructor(message?: string) {
    super(message || 'Password is too long');
    this.name = 'PasswordTooLongError';
  }
}

export class PasswordWeakError extends Error {
  constructor(message?: string) {
    super(
      message ||
        'Password is too weak. It must contain at least one uppercase letter, one lowercase letter, one number, one special character and must be at least 6 characters long.',
    );
    this.name = 'PasswordWeakError';
  }
}
