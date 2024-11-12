import { Application } from '@/application/dtos';
import { ApplicationService } from '@/application/services';
import { APPLICATION_REPOSITORY, IApplicationRepository } from '@/core/contracts';
import { ApplicationNotFoundError } from '@/core/errors';
import { Inject, Injectable } from '@nestjs/common';

namespace FindApplicationById {
  export type Input = {
    id: string;
  };

  export type Output = Application;
}

@Injectable()
export class FindApplicationByIdUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IApplicationRepository,
    private readonly applicationService: ApplicationService,
  ) {}
  async execute(input: FindApplicationById.Input): Promise<FindApplicationById.Output> {
    const applicationExists = await this.applicationRepository.findById({ id: input.id });
    if (!applicationExists) throw new ApplicationNotFoundError();

    return this.applicationService.toDto(applicationExists);
  }
}
