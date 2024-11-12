import {
  PasswordTooLongError,
  PasswordTooShortError,
  PasswordWeakError,
} from '@/core/@seedwork/domain/errors/password.error';
import { ValueObject } from './value-object';

export class Password extends ValueObject<string> {
  constructor(password: string) {
    super(password);
  }

  validate() {
    const MIN_PASSWORD_LENGTH = 6;
    const MAX_PASSWORD_LENGTH = 32;

    if (this.value.length < MIN_PASSWORD_LENGTH) {
      throw new PasswordTooShortError();
    }

    if (this.value.length > MAX_PASSWORD_LENGTH) {
      throw new PasswordTooLongError();
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    if (!passwordRegex.test(this.value)) {
      throw new PasswordWeakError();
    }
  }
}

export default Password;
