export interface IEntityService<T, U> {
  toDto(entity: T): U;
}
