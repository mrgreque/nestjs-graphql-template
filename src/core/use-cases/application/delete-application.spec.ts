import { ApplicationRepository } from '@/application/repositories';
import { APPLICATION_REPOSITORY } from '@/core/contracts';
import { testHelpers } from '@/test/helpers';
import { testContext } from '@/test/test-context';
import { ApplicationEntity } from '@/core/entites';
import { DeleteApplicationUseCase } from './delete-application.use-case';

testContext('delete application test', (resolver) => {
  let applicationRepository: ApplicationRepository;
  let deleteApplicationUseCase: DeleteApplicationUseCase;

  beforeAll(() => {
    applicationRepository = resolver(APPLICATION_REPOSITORY);
    deleteApplicationUseCase = resolver(DeleteApplicationUseCase);
  });

  describe('negative', () => {
    it('should not delete the application if application does not exist', async () => {
      const response = await deleteApplicationUseCase.execute({ id: testHelpers.random.objectId() });

      expect(response.success).toBe(false);
      expect(response.errorMessage).toBe('Application not found');
    });
  });

  describe('positive', () => {
    it('should properly delete application', async () => {
      const applicationName = 'Application Test';

      const application = ApplicationEntity.create({ name: applicationName });
      await applicationRepository.insert(application);

      const foundApplication = await applicationRepository.findById({ id: application.id });
      expect(foundApplication).toMatchObject({
        id: application.id,
        props: {
          name: applicationName,
        },
      });

      const response = await deleteApplicationUseCase.execute({ id: application.id });

      expect(response.success).toBe(true);

      const deletedApplication = await applicationRepository.findById({ id: application.id });
      expect(deletedApplication).toBeNull();
    });
  });
});
