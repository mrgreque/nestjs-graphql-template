import { Application } from '@/application/dtos';
import { ApplicationService } from '@/application/services';
import { APPLICATION_REPOSITORY, IApplicationRepository } from '@/core/contracts';
import { ApplicationNameIsAlreadyTakenError, ApplicationNotFoundError } from '@/core/errors';
import { Inject, Injectable } from '@nestjs/common';

namespace UpdateApplication {
  export type Input = {
    id: string;
    name: string;
    screensaver?: string;
  };

  export type Output = {
    success: boolean;
    errorMessage?: string;
    application?: Application;
  };
}

@Injectable()
export class UpdateApplicationUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IApplicationRepository,
    private readonly applicationService: ApplicationService,
  ) {}
  async execute(input: UpdateApplication.Input): Promise<UpdateApplication.Output> {
    try {
      const applicationExists = await this.applicationRepository.findById({ id: input.id });
      if (!applicationExists) throw new ApplicationNotFoundError();

      const newApplication = applicationExists.update(input);
      newApplication.validate();

      if (input?.name !== applicationExists.props.name) {
        const applicationNamAlreadyTaken = await this.applicationRepository.findByName(newApplication.props);
        if (applicationNamAlreadyTaken) throw new ApplicationNameIsAlreadyTakenError();
      }

      await this.applicationRepository.update({ application: newApplication, keysToUpdate: Object.keys(input) });

      return { success: true, application: this.applicationService.toDto(newApplication) };
    } catch (error) {
      return { success: false, errorMessage: error.message };
    }
  }
}
