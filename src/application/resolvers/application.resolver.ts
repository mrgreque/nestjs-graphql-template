import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateApplicationUseCase,
  DeleteApplicationUseCase,
  FindApplicationByIdUseCase,
  FindApplicationsUseCase,
  UpdateApplicationUseCase,
} from '@/core/use-cases';
import {
  Application,
  ByIdInput,
  CreateApplicationInput,
  CreateApplicationResponse,
  DefaultOperationResponse,
  DefaultPaginationInput,
  FindApplicationsOutput,
  UpdateApplicationInput,
  UpdateApplicationResponse,
} from '@/application/dtos';
import { JwtAuthGuard } from '@/application/guards';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class ApplicationResolver {
  constructor(
    private readonly createApplicationUseCase: CreateApplicationUseCase,
    private readonly updateApplicationUseCase: UpdateApplicationUseCase,
    private readonly deleteApplicationUseCase: DeleteApplicationUseCase,
    private readonly finApplicationsUseCase: FindApplicationsUseCase,
    private readonly findApplicationByIdUseCase: FindApplicationByIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CreateApplicationResponse)
  async createApplication(
    @Args('data')
    application: CreateApplicationInput,
  ): Promise<CreateApplicationResponse> {
    return await this.createApplicationUseCase.execute({
      name: application.name,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UpdateApplicationResponse)
  async updateApplication(
    @Args('data')
    application: UpdateApplicationInput,
  ): Promise<UpdateApplicationResponse> {
    return await this.updateApplicationUseCase.execute(application);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => DefaultOperationResponse)
  async deleteApplication(
    @Args()
    id: ByIdInput,
  ): Promise<DefaultOperationResponse> {
    return await this.deleteApplicationUseCase.execute(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => FindApplicationsOutput)
  async applications(
    @Args('pagination')
    pagination: DefaultPaginationInput,
  ): Promise<FindApplicationsOutput> {
    return await this.finApplicationsUseCase.execute(pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Application)
  async application(
    @Args()
    id: ByIdInput,
  ): Promise<Application> {
    return await this.findApplicationByIdUseCase.execute(id);
  }
}
