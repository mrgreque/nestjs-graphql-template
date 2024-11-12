// export function makeAlignedSetToUpdate<T>(
//   entity: { id: string; props: T },
//   keysToUpdate: string[],
//   collection: string,
// ): object {
//   return Object.keys(entity.props).reduce((acc, key) => {
//     if (keysToUpdate.includes(key) && !key.includes('id') && !key.includes('Id')) {
//       acc[`${collection}.$.${key}`] = entity.props[key];
//     }
//     return acc;
//   }, {});
// }
export function makeSetToUpdate<T>(entity: { id: string; props: T }, keysToUpdate: string[]): object {
  return Object.keys(entity.props).reduce((acc, key) => {
    if (keysToUpdate.includes(key) && !key.includes('id') && !key.includes('Id')) {
      acc[key] = entity.props[key];
    }
    return acc;
  }, {});
}
