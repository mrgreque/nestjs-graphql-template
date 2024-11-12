import { InvalidEmailError } from '@/core/@seedwork/domain/errors/email.error';
import { ValueObject } from './value-object';

export class Email extends ValueObject<string> {
  constructor(email: string) {
    super(email.toLowerCase());
  }

  validate() {
    const isValid = this.value.toLowerCase().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    if (!isValid) {
      throw new InvalidEmailError();
    }
  }
}

export default Email;
