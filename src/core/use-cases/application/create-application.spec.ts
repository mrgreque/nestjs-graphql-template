import { ApplicationRepository } from '@/application/repositories';
import { APPLICATION_REPOSITORY } from '@/core/contracts';
import { CreateApplicationUseCase } from '@/core/use-cases/application/create-application.use-case';
import { testHelpers } from '@/test/helpers';
import { testContext } from '@/test/test-context';

testContext('create application test', (resolver) => {
  let applicationRepository: ApplicationRepository;
  let createApplicationUseCase: CreateApplicationUseCase;

  beforeAll(() => {
    applicationRepository = resolver(APPLICATION_REPOSITORY);
    createApplicationUseCase = resolver(CreateApplicationUseCase);
  });

  describe('negative', () => {
    it('should not create if input is not valid', async () => {
      const response = await createApplicationUseCase.execute({
        name: '',
      });

      expect(response).toEqual({ success: false, errorMessage: 'Required fields are missing' });
    });

    it('should not create if name already exists', async () => {
      const firstResponse = await createApplicationUseCase.execute({
        name: 'Application One',
      });

      expect(firstResponse).toEqual({
        success: true,
        application: {
          id: expect.any(String),
          name: 'Application One',
        },
      });

      const secondResponse = await createApplicationUseCase.execute({
        name: 'application one',
      });

      expect(secondResponse).toEqual({ success: false, errorMessage: 'Application name is already taken' });
    });

    it('should not create if name is too short', async () => {
      // max name limit is 128 characters
      const name = testHelpers.random.string(3);

      const response = await createApplicationUseCase.execute({
        name,
      });

      expect(response).toEqual({ success: false, errorMessage: 'Application name is too short' });
    });

    it('should not create if name is too long', async () => {
      // max name limit is 128 characters
      const name = testHelpers.random.string(129);

      const response = await createApplicationUseCase.execute({
        name,
      });

      expect(response).toEqual({ success: false, errorMessage: 'Application name is too long' });
    });
  });

  describe('positive', () => {
    it('should properly create the application', async () => {
      const firstAppName = testHelpers.random.string(12);
      const secondAppName = testHelpers.random.string(12);

      const firstApplication = await createApplicationUseCase.execute({ name: firstAppName });
      expect(firstApplication).toEqual({ success: true, application: { id: expect.any(String), name: firstAppName } });

      const firstApplicationList = await applicationRepository.findAll({ page: 0, limit: 10 });
      expect(firstApplicationList.applications.length).toBe(1);

      const secondApplication = await createApplicationUseCase.execute({ name: secondAppName });
      expect(secondApplication).toEqual({
        success: true,
        application: { id: expect.any(String), name: secondAppName },
      });

      const secondApplicationList = await applicationRepository.findAll({ page: 0, limit: 10 });
      expect(secondApplicationList.applications.length).toBe(2);
    });
  });
});
