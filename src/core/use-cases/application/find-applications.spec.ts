import { ApplicationRepository } from '@/application/repositories';
import { APPLICATION_REPOSITORY } from '@/core/contracts';
import { testContext } from '@/test/test-context';
import { ApplicationEntity } from '@/core/entites';
import { FindApplicationsUseCase } from './find-applications.use-case';

testContext('find user test', (resolver) => {
  let applicationRepository: ApplicationRepository;
  let findApplications: FindApplicationsUseCase;

  beforeAll(() => {
    applicationRepository = resolver(APPLICATION_REPOSITORY);
    findApplications = resolver(FindApplicationsUseCase);
  });

  describe('positive', () => {
    it('should properly find applications', async () => {
      const mockApplications = [{ name: 'test1' }, { name: 'test2' }];

      for (const application of mockApplications) {
        const applicationEntity = ApplicationEntity.create({ name: application.name });
        await applicationRepository.insert(applicationEntity);
      }

      const response = await findApplications.execute({ page: 1, limit: 10 });

      expect(response.records).toBe(2);
      expect(response.applications).toHaveLength(2);
      expect(response.hasNext).toBe(false);
      expect(response.applications[0]).toMatchObject({
        id: expect.any(String),
        name: mockApplications[0].name,
      });

      const paginatedResponse = await findApplications.execute({ page: 1, limit: 1 });
      expect(paginatedResponse.records).toBe(2);
      expect(paginatedResponse.applications).toHaveLength(1);
      expect(paginatedResponse.hasNext).toBe(true);
    });
  });

  it('should properly find applications without items', async () => {
    const response = await findApplications.execute({ page: 1, limit: 10 });
    expect(response.records).toBe(0);
    expect(response).toEqual({
      records: 0,
      applications: [],
      hasNext: false,
    });
  });
});
