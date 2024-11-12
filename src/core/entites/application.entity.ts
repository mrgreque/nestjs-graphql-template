import { Entity } from '@/core/@seedwork/domain/entity';
import { IApplication } from '@/core/types';
import { MissingRequiredFieldsError, NameIsTooLongError, NameIsTooShortError } from '@/core/errors';

export class ApplicationEntity extends Entity<IApplication> {
  private constructor(props: IApplication, id?: string) {
    super(props, id);
  }

  validate() {
    const input = this.props;

    if (!input.name) throw new MissingRequiredFieldsError();

    const NAME_MAX_LENGTH = 128;
    const NAME_MIN_LENGTH = 4;

    if (input.name.length > NAME_MAX_LENGTH) throw new NameIsTooLongError();
    if (input.name.length < NAME_MIN_LENGTH) throw new NameIsTooShortError();
  }

  public static create(props: IApplication): ApplicationEntity {
    return new ApplicationEntity(props);
  }

  public static restore(props: IApplication): ApplicationEntity {
    const { id, ...rest } = props;

    return new ApplicationEntity(rest, id);
  }

  update(props: Partial<IApplication>): ApplicationEntity {
    const payload = { ...this.props, ...props };

    return new ApplicationEntity(payload, this.id);
  }
}
