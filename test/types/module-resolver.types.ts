import { Abstract, Type } from '@nestjs/common';

export type ModuleResolver = <T>(module: string | symbol | Type<T> | Abstract<T>) => T;
