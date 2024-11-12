import { Application } from '@/application/dtos';
import { ApplicationService } from '@/application/services';
import { APPLICATION_REPOSITORY, IApplicationRepository } from '@/core/contracts';
import { ApplicationEntity } from '@/core/entites';
import { ApplicationNameIsAlreadyTakenError } from '@/core/errors';
import { Inject, Injectable } from '@nestjs/common';

namespace CreateApplication {
  export type Input = {
    name: string;
  };

  export type Output = {
    success: boolean;
    errorMessage?: string;
    application?: Application;
  };
}

@Injectable()
export class CreateApplicationUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IApplicationRepository,
    private readonly applicationService: ApplicationService,
  ) {}
  async execute(input: CreateApplication.Input): Promise<CreateApplication.Output> {
    try {
      const application = ApplicationEntity.create({ name: input.name });
      application.validate();

      const applicationExists = await this.applicationRepository.findByName(application.props);
      if (applicationExists) throw new ApplicationNameIsAlreadyTakenError();

      await this.applicationRepository.insert(application);

      return { success: true, application: this.applicationService.toDto(application) };
    } catch (error) {
      return { success: false, errorMessage: error.message };
    }
  }
}
