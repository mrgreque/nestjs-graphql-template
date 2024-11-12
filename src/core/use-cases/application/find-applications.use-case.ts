import { Application } from '@/application/dtos';
import { ApplicationService } from '@/application/services';
import { APPLICATION_REPOSITORY, IApplicationRepository } from '@/core/contracts';
import { Inject, Injectable } from '@nestjs/common';

namespace FindApplications {
  export type Input = {
    page: number;
    limit: number;
  };

  export type Output = {
    records: number;
    hasNext: boolean;
    applications: Application[];
  };
}

@Injectable()
export class FindApplicationsUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IApplicationRepository,
    private readonly applicationService: ApplicationService,
  ) {}
  async execute(input: FindApplications.Input): Promise<FindApplications.Output> {
    const result = await this.applicationRepository.findAll({ page: input.page - 1, limit: input.limit });
    const formattedApplications = result.applications.map((user) => this.applicationService.toDto(user));
    return { ...result, applications: formattedApplications };
  }
}
