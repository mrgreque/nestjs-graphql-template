export class LoginOrPasswordInvalidError extends Error {
  constructor(message?: string) {
    super(message || 'Login or password is invalid');
    this.name = 'LoginOrPasswordInvalidError';
  }
}

export class ExpiredRefreshTokenError extends Error {
  constructor(message?: string) {
    super(message || 'Expired refresh token. Please, login again');
    this.name = 'ExpiredRefreshTokenError';
  }
}

export class UserUnauthorizedError extends Error {
  constructor(message?: string) {
    super(message || 'User Unauthorized. Please contact the admin to verify your role.');
    this.name = 'UserUnauthorizedError';
  }
}
export class UserAuthFromInexistentUserError extends Error {
  constructor(message?: string) {
    super(message || 'User auth does not exist');
    this.name = 'UserAuthFromInexistentUserError';
  }
}
