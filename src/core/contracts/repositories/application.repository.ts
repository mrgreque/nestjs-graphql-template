import { ApplicationEntity } from '@/core/entites';

export const APPLICATION_REPOSITORY = Symbol('ApplicationRepository');

export namespace FindApplicationById {
  export type Input = {
    id: string;
  };
  export type Output = ApplicationEntity | null;
}

export namespace FindApplicationByName {
  export type Input = {
    name: string;
  };
  export type Output = ApplicationEntity;
}

export namespace FindApplications {
  export type Input = {
    page: number;
    limit: number;
  };
  export type Output = {
    records: number;
    hasNext: boolean;
    applications: ApplicationEntity[];
  };
}

export namespace CreateApplication {
  export type Input = ApplicationEntity;
  export type Output = void;
}

export namespace UpdateApplication {
  export type Input = {
    application: ApplicationEntity;
    keysToUpdate: string[];
  };
  export type Output = void;
}

export namespace DeleteApplication {
  export type Input = {
    id: string;
  };
  export type Output = void;
}

export interface IApplicationRepository {
  findById(input: FindApplicationById.Input): Promise<FindApplicationById.Output>;
  findByName(input: FindApplicationByName.Input): Promise<FindApplicationByName.Output>;
  findAll(pagination?: FindApplications.Input): Promise<FindApplications.Output>;
  insert(application: CreateApplication.Input): Promise<CreateApplication.Output>;
  update(application: UpdateApplication.Input): Promise<UpdateApplication.Output>;
  delete(input: DeleteApplication.Input): Promise<DeleteApplication.Output>;
}
