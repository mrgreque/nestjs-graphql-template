import { APPLICATION_REPOSITORY, IApplicationRepository } from '@/core/contracts';
import { ApplicationNotFoundError } from '@/core/errors';
import { Inject, Injectable } from '@nestjs/common';

namespace DeleteApplication {
  export type Input = {
    id: string;
  };

  export type Output = {
    success: boolean;
    errorMessage?: string;
  };
}

@Injectable()
export class DeleteApplicationUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IApplicationRepository,
  ) {}
  async execute(input: DeleteApplication.Input): Promise<DeleteApplication.Output> {
    try {
      const applicationExists = await this.applicationRepository.findById({ id: input.id });
      if (!applicationExists) throw new ApplicationNotFoundError();

      await this.applicationRepository.delete({ id: input.id });

      return { success: true };
    } catch (error) {
      return { success: false, errorMessage: error.message };
    }
  }
}
