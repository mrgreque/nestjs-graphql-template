import { ApplicationEntity } from '@/core/entites';
import { Application } from '@/application/dtos';
import { IEntityService } from '@/core/contracts';
import { IApplication } from '@/core/types';
import { entityToDto } from '@/core/helpers';
export class ApplicationService implements IEntityService<ApplicationEntity, Application> {
  toDto(application: ApplicationEntity): Application {
    return entityToDto<IApplication, Application>(application);
  }
}
