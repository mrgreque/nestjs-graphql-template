import { ApplicationRepository } from '@/application/repositories';
import { APPLICATION_REPOSITORY } from '@/core/contracts';
import { testHelpers } from '@/test/helpers';
import { testContext } from '@/test/test-context';
import { ApplicationEntity } from '@/core/entites';
import { ApplicationNotFoundError } from '@/core/errors';
import { FindApplicationByIdUseCase } from './find-application-by-id.use-case';

testContext('find application test', (resolver) => {
  let applicationRepository: ApplicationRepository;
  let finApplicationByIdUseCase: FindApplicationByIdUseCase;

  beforeAll(() => {
    applicationRepository = resolver(APPLICATION_REPOSITORY);
    finApplicationByIdUseCase = resolver(FindApplicationByIdUseCase);
  });

  describe('negative', () => {
    it('should not find the application if application does not exist', async () => {
      const response = finApplicationByIdUseCase.execute({ id: testHelpers.random.objectId() });

      await expect(response).rejects.toThrow(ApplicationNotFoundError);
    });
  });

  describe('positive', () => {
    it('should properly find application', async () => {
      const applicationName = 'Test Application';

      const application = ApplicationEntity.create({ name: applicationName });
      await applicationRepository.insert(application);

      const response = await finApplicationByIdUseCase.execute({ id: application.id });

      expect(response).toMatchObject({
        id: expect.any(String),
        name: 'Test Application',
      });
    });
  });
});
