import { ModuleResolver } from '@/test/types';

export type EntityCreator<T, K> = (
  moduleResolver: ModuleResolver,
  properties?: Partial<T>,
  aditionalProps?: object,
) => Promise<K>;
