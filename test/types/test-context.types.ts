import { ModuleResolver } from '@/test/types';

type TestContextOptions = Partial<{
  restoreDatabase: boolean;
  restoreCache: boolean;
  restoreEnv: boolean;
}>;
export type TestContext = (
  name: string,
  testsFn: (moduleResolver: ModuleResolver) => void,
  options?: TestContextOptions,
) => void;
