import { Entity } from '@/core/@seedwork/domain/entity';
import Email from '@/core/@seedwork/domain/value-objects/email';
import Password from '@/core/@seedwork/domain/value-objects/password';
import { ISession, IUpdateToken, IUser } from '@/core/types';

export class UserEntity extends Entity<IUser> {
  private constructor(props: IUser, id?: string) {
    super(props, id);
  }

  validate() {
    const input = this.props;

    const email = new Email(input.email);
    email.validate();

    const password = new Password(input.password);
    password.validate();
  }

  public static create(props: IUser): UserEntity {
    return new UserEntity(props);
  }

  public static restore(props: IUser): UserEntity {
    const { id, ...rest } = props;

    return new UserEntity(rest, id);
  }

  update(props: Partial<IUser>): UserEntity {
    const payload = { ...this.props, ...props };

    return new UserEntity(payload, this.id);
  }

  changeSessionToken({ token, refreshToken }: IUpdateToken) {
    if (!this.props.session) this.props.session = {} as ISession;
    this.props.session.token = token;
    if (refreshToken) this.props.session.refreshToken = refreshToken;
  }

  validateEmail() {
    const email = new Email(this.props.email);
    return email.validate();
  }
}
