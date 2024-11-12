import { UniqueEntityId } from '@/core/@seedwork/domain/value-objects';

export abstract class Entity<T> {
  public props: T;
  public id: string;

  constructor(props: T, id?: string) {
    const uniqueId = new UniqueEntityId(id || '');

    this.props = props;
    this.id = uniqueId.value;
  }
}
