import { app, testContext } from './test-context';
import { defaultLogin } from './helpers/auth';
import { gqlRequest } from './helpers/e2e/request-gql';
import { testHelpers } from './helpers/test-helpers';
import {
  ApplicationNameIsAlreadyTakenError,
  ApplicationNotFoundError,
  MissingRequiredFieldsError,
  NameIsTooLongError,
  NameIsTooShortError,
} from '@/core/errors';
import { seedMongoDb } from './seeds/mongo.seeder';

testContext('create application test', (_) => {
  let auth = {
    token: '',
    refreshToken: '',
  };

  beforeEach(async () => {
    await seedMongoDb();
    auth = await defaultLogin(app);
  });

  describe('create application', () => {
    describe('positive', () => {
      it('should properly create the application', async () => {
        const createApplicationProps = {
          operator: 'mutation',
          operation: 'createApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ name: "New Test Application" }',
          },
        };
        const data = await gqlRequest(app, createApplicationProps, auth.token);

        const { body, error, status } = data;
        expect(body.data.createApplication.success).toBeTruthy();
        expect(body.data.createApplication.errorMessage).toBeNull();
        expect(error).toBeFalsy();
        expect(status).toEqual(200);
      });
    });

    describe('negative', () => {
      it('should not create the application if name is invalid', async () => {
        const createApplicationProps = {
          operator: 'mutation',
          operation: 'createApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ name: "" }',
          },
        };
        const data = await gqlRequest(app, createApplicationProps, auth.token);

        const { body, status } = data;
        expect(body.data.createApplication.success).toBeFalsy();
        expect(body.data.createApplication.errorMessage).toEqual(new MissingRequiredFieldsError().message);
        expect(status).toEqual(200);
      });

      it('should not create the application if name is short', async () => {
        const randomName = testHelpers.random.string(3);

        const createApplicationProps = {
          operator: 'mutation',
          operation: 'createApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: `{ name: "${randomName}" }`,
          },
        };
        const data = await gqlRequest(app, createApplicationProps, auth.token);

        const { body, status } = data;
        expect(body.data.createApplication.success).toBeFalsy();
        expect(body.data.createApplication.errorMessage).toEqual(new NameIsTooShortError().message);
        expect(status).toEqual(200);
      });

      it('should not create the application if name is too long', async () => {
        const randomName = testHelpers.random.string(129); // <= 128

        const createApplicationProps = {
          operator: 'mutation',
          operation: 'createApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: `{ name: "${randomName}" }`,
          },
        };
        const data = await gqlRequest(app, createApplicationProps, auth.token);

        const { body, status } = data;
        expect(body.data.createApplication.success).toBeFalsy();
        expect(body.data.createApplication.errorMessage).toEqual(new NameIsTooLongError().message);
        expect(status).toEqual(200);
      });

      it('should not create if application name already taken', async () => {
        const createApplicationProps = {
          operator: 'mutation',
          operation: 'createApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ name: "Test Application" }',
          },
        };
        const data = await gqlRequest(app, createApplicationProps, auth.token);

        const { body, status } = data;
        expect(body.data.createApplication.success).toBeFalsy();
        expect(body.data.createApplication.errorMessage).toEqual(new ApplicationNameIsAlreadyTakenError().message);
        expect(status).toEqual(200);
      });
    });
  });

  describe('update application', () => {
    describe('positive', () => {
      it('should properly update the application', async () => {
        const createApplicationProps = {
          operator: 'mutation',
          operation: 'updateApplication',
          responseFields: ['success', 'errorMessage', 'application { id, name }'],
          variables: {
            data: `{ 
              id: "111111111111111111111111", 
              name: "New Test Application 2",
            }`,
          },
        };
        const data = await gqlRequest(app, createApplicationProps, auth.token);

        const { body, error } = data;
        expect(body.data.updateApplication.success).toBeTruthy();
        expect(body.data.updateApplication.errorMessage).toBeNull();
        expect(body.data.updateApplication.application.name).toEqual('New Test Application 2');
        expect(error).toBeFalsy();
      });
    });

    describe('negative', () => {
      it('should not update the application if name is short', async () => {
        const name = testHelpers.random.string(3); // >= 4

        const updateApplicationProps = {
          operator: 'mutation',
          operation: 'updateApplication',
          responseFields: ['success', 'errorMessage', 'application { id, name }'],
          variables: {
            data: `{ id: "111111111111111111111111", name: "${name}" }`,
          },
        };
        const data = await gqlRequest(app, updateApplicationProps, auth.token);

        const { body, status } = data;
        expect(body.data.updateApplication.success).toBeFalsy();
        expect(body.data.updateApplication.errorMessage).toEqual(new NameIsTooShortError().message);
        expect(status).toEqual(200);
      });

      it('should not update the application if name is too long', async () => {
        const name = testHelpers.random.string(129); // <= 128

        const updateUserProps = {
          operator: 'mutation',
          operation: 'updateApplication',
          responseFields: ['success', 'errorMessage', 'application { id, name }'],
          variables: {
            data: `{ id: "111111111111111111111111", name: "${name}" }`,
          },
        };
        const data = await gqlRequest(app, updateUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.updateApplication.success).toBeFalsy();
        expect(body.data.updateApplication.errorMessage).toEqual(new NameIsTooLongError().message);
        expect(status).toEqual(200);
      });

      it('should not update application if name is already taken', async () => {
        const createUserProps = {
          operator: 'mutation',
          operation: 'createApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ name: "Test Application 4" }',
          },
        };
        await gqlRequest(app, createUserProps, auth.token);

        const updateUserProps = {
          operator: 'mutation',
          operation: 'updateApplication',
          responseFields: ['success', 'errorMessage', 'application { id, name }'],
          variables: {
            data: `{ id: "111111111111111111111111", name: "Test Application 4" }`,
          },
        };
        const data = await gqlRequest(app, updateUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.updateApplication.success).toBeFalsy();
        expect(body.data.updateApplication.errorMessage).toEqual(new ApplicationNameIsAlreadyTakenError().message);
        expect(status).toEqual(200);
      });

      it('should not create if application not found', async () => {
        const updateUserProps = {
          operator: 'mutation',
          operation: 'updateApplication',
          responseFields: ['success', 'errorMessage', 'application { id, name }'],
          variables: {
            data: `{ id: "111111111111111111111112", name: "Test Test" }`,
          },
        };
        const data = await gqlRequest(app, updateUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.updateApplication.success).toBeFalsy();
        expect(body.data.updateApplication.errorMessage).toEqual(new ApplicationNotFoundError().message);
        expect(status).toEqual(200);
      });
    });
  });

  describe('delete application', () => {
    describe('positive', () => {
      it('should properly delete the application', async () => {
        const createApplicationProps = {
          operator: 'mutation',
          operation: 'deleteApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            id: '"111111111111111111111111"',
          },
        };
        const data = await gqlRequest(app, createApplicationProps, auth.token);

        const { body, error } = data;
        expect(body.data.deleteApplication.success).toBeTruthy();
        expect(body.data.deleteApplication.errorMessage).toBeNull();
        expect(error).toBeFalsy();
      });
    });

    describe('negative', () => {
      it('should not delete if application not found', async () => {
        const deleteApplicationProps = {
          operator: 'mutation',
          operation: 'deleteApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            id: '"111111111111111111111112"',
          },
        };
        const data = await gqlRequest(app, deleteApplicationProps, auth.token);

        const { body, status } = data;
        expect(body.data.deleteApplication.success).toBeFalsy();
        expect(body.data.deleteApplication.errorMessage).toEqual(new ApplicationNotFoundError().message);
        expect(status).toEqual(200);
      });
    });
  });

  describe('find application', () => {
    describe('positive', () => {
      it('should properly find the application by id', async () => {
        const getApplicationProps = {
          operator: 'query',
          operation: 'application',
          responseFields: ['id', 'name'],
          variables: { id: '"111111111111111111111111"' },
        };
        const data = await gqlRequest(app, getApplicationProps, auth.token);

        const { body, error } = data;
        expect(body.data.application.id).toEqual('111111111111111111111111');
        expect(body.data.application.name).toEqual('Test Application');
        expect(error).toBeFalsy();
      });
    });

    describe('negative', () => {
      it('should not find if application not found', async () => {
        const getApplicationProps = {
          operator: 'query',
          operation: 'application',
          responseFields: ['id', 'name'],
          variables: { id: '"111111111111111111111112"' },
        };
        const data = await gqlRequest(app, getApplicationProps, auth.token);

        const { body, status } = data;
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual(new ApplicationNotFoundError().message);
        expect(status).toEqual(200);
      });
    });
  });

  describe('find all applications', () => {
    describe('positive', () => {
      it('should properly find all applications', async () => {
        const getApplicationsProps = {
          operator: 'query',
          operation: 'applications',
          responseFields: ['records', 'hasNext', 'applications { id, name }'],
          variables: {
            pagination: '{ page: 1, limit: 2 }',
          },
        };
        const data = await gqlRequest(app, getApplicationsProps, auth.token);

        const { body, error } = data;
        expect(body.data.applications.records).toEqual(1);
        expect(body.data.applications.hasNext).toEqual(false);
        expect(body.data.applications.applications[0].name).toEqual('Test Application');
        expect(error).toBeFalsy();
      });

      it('should return an empty array when over the limit', async () => {
        const getApplicationsProps = {
          operator: 'query',
          operation: 'applications',
          responseFields: ['records', 'hasNext', 'applications { id, name }'],
          variables: {
            pagination: '{ page: 2, limit: 2 }',
          },
        };
        const data = await gqlRequest(app, getApplicationsProps, auth.token);

        const { body, error } = data;
        expect(body.data.applications.records).toEqual(1);
        expect(body.data.applications.hasNext).toEqual(false);
        expect(body.data.applications.applications.length).toEqual(0);
        expect(error).toBeFalsy();
      });
    });
  });
});
