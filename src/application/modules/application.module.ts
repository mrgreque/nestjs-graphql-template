import { Module } from '@nestjs/common';
import { ApplicationResolver } from '@/application/resolvers';
import { ApplicationRepository } from '@/application/repositories';
import { APPLICATION_REPOSITORY} from '@/core/contracts';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Application as ApplicationModel,
  ApplicationSchema,
} from '../mongoose';
import {
  CreateApplicationUseCase,
  DeleteApplicationUseCase,
  FindApplicationByIdUseCase,
  FindApplicationsUseCase,
  UpdateApplicationUseCase,
} from '@/core/use-cases';
import { ApplicationService } from '../services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ApplicationModel.name,
        schema: ApplicationSchema,
      },
    ]),
  ],
  providers: [
    // Services
    ApplicationService,

    // Resolvers
    ApplicationResolver,

    // Repositories
    {
      provide: APPLICATION_REPOSITORY,
      useClass: ApplicationRepository,
    },

    // Use Cases
    CreateApplicationUseCase,
    UpdateApplicationUseCase,
    FindApplicationByIdUseCase,
    FindApplicationsUseCase,
    DeleteApplicationUseCase,
  ],
})
export class ApplicationModule {}
