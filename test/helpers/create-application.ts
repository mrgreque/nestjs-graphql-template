import { ApplicationRepository } from '@/application/repositories';
import { APPLICATION_REPOSITORY } from '@/core/contracts';
import { ApplicationEntity } from '@/core/entites';
import { IApplication } from '@/core/types';
import { testHelpers } from '@/test/helpers';
import { EntityCreator } from '@/test/types';

export const createApplication: EntityCreator<IApplication, ApplicationEntity | null> = async (
  resolver,
  properties = {},
) => {
  const attributes = Object.assign({}, properties);

  const applicationRepository: ApplicationRepository = resolver(APPLICATION_REPOSITORY);

  const payload: IApplication = {
    name: attributes.name ?? testHelpers.random.string(12),
    ...attributes,
  };

  const application = ApplicationEntity.create(payload);
  await applicationRepository.insert(application);
  const createdApplication = await applicationRepository.findByName(payload);

  return createdApplication;
};
