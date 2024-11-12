export function entityToDto<T, U>(entity: { id: string; props: T }): U {
  const { id, props } = entity;
  let obj = { id } as U;
  Object.keys(props).forEach((key) => {
    obj = {
      ...obj,
      ...(typeof props[key] === 'boolean' ? { [key]: props[key] } : props[key] && { [key]: props[key] }),
    };
  });

  return obj;
}
