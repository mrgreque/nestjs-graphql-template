import { ApplicationRepository } from '@/application/repositories';
import { APPLICATION_REPOSITORY } from '@/core/contracts';
import { ApplicationEntity } from '@/core/entites';
import { testHelpers } from '@/test/helpers';
import { testContext } from '@/test/test-context';
import { UpdateApplicationUseCase } from './update-application.use-case';

testContext('update application test', (resolver) => {
  let applicationRepository: ApplicationRepository;
  let updateApplicationUseCase: UpdateApplicationUseCase;

  beforeAll(() => {
    applicationRepository = resolver(APPLICATION_REPOSITORY);
    updateApplicationUseCase = resolver(UpdateApplicationUseCase);
  });

  describe('negative', () => {
    it('should not update the application if name is invalid (short)', async () => {
      const name = 'Test Application';

      const application = ApplicationEntity.create({ name });
      await applicationRepository.insert(application);

      const newName = testHelpers.random.string(3); // >= 4

      const response = await updateApplicationUseCase.execute({
        id: application.id,
        name: newName,
      });

      expect(response).toEqual({ success: false, errorMessage: 'Application name is too short' });
    });

    it('should not update the application if name is invalid (too long)', async () => {
      const name = 'Test Application';

      const application = ApplicationEntity.create({ name });
      await applicationRepository.insert(application);

      const newName = testHelpers.random.string(129); // <= 128

      const response = await updateApplicationUseCase.execute({
        id: application.id,
        name: newName,
      });

      expect(response).toEqual({ success: false, errorMessage: 'Application name is too long' });
    });

    it('should not update if application does not exist', async () => {
      const name = 'Test Application';

      const response = await updateApplicationUseCase.execute({
        id: testHelpers.random.objectId(),
        name,
      });

      expect(response).toEqual({ success: false, errorMessage: 'Application not found' });
    });

    it('should not update the application if name already taken', async () => {
      const name = 'Test Name';
      const newName = 'Test Name 2';

      const application = ApplicationEntity.create({ name });
      await applicationRepository.insert(application);

      const secondUser = ApplicationEntity.create({ name: newName });
      await applicationRepository.insert(secondUser);

      const response = await updateApplicationUseCase.execute({
        id: application.id,
        name: newName,
      });

      expect(response).toEqual({ success: false, errorMessage: 'Application name is already taken' });
    });
  });

  describe('positive', () => {
    it('should properly update the application', async () => {
      const name = 'Test Application';

      const application = ApplicationEntity.create({ name });
      await applicationRepository.insert(application);

      const savedApplication = await applicationRepository.findByName({ name });
      const lastName = savedApplication.props.name;

      const newName = 'Test Application 2';
      const response = await updateApplicationUseCase.execute({
        id: application.id,
        name: newName,
      });

      expect(response).toMatchObject({
        success: true,
        application: {
          id: expect.any(String),
          name: newName,
        },
      });

      expect(response.application.name).not.toEqual(lastName);
    });
  });
});
