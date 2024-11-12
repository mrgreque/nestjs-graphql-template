export class ApplicationNameIsAlreadyTakenError extends Error {
  constructor(message?: string) {
    super(message || 'Application name is already taken');
    this.name = 'ApplicationNameIsAlreadyTakenError';
  }
}

export class NameIsTooLongError extends Error {
  constructor(message?: string) {
    super(message || 'Application name is too long');
    this.name = 'NameIsTooLongError';
  }
}

export class NameIsTooShortError extends Error {
  constructor(message?: string) {
    super(message || 'Application name is too short');
    this.name = 'NameIsTooShortError';
  }
}

export class ApplicationNotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'Application not found');
    this.name = 'ApplicationNotFoundError';
  }
}
