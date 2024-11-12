import { app, testContext } from './test-context';
import { seedMongoDb } from './seeds/mongo.seeder';
import { defaultLogin } from './helpers/auth';
import { gqlRequest } from './helpers/e2e/request-gql';
import { testHelpers } from './helpers/test-helpers';
import {
  PasswordTooLongError,
  PasswordTooShortError,
  PasswordWeakError,
} from '@/core/@seedwork/domain/errors/password.error';
import { InvalidEmailError } from '@/core/@seedwork/domain/errors/email.error';
import { EmailAlreadyTakenError, UserAlreadyExistsError, UserNotFoundError } from '@/core/errors';
// import { UniqueEntityId } from '@/core/@seedwork/domain/value-objects';
import mongoose from 'mongoose';
import InvalidObjectIdError from '@/core/@seedwork/domain/errors/invalid-object-id.error';

testContext('create user test', (_) => {
  let auth = {
    token: '',
    refreshToken: '',
  };

  beforeEach(async () => {
    await seedMongoDb();
    auth = await defaultLogin(app);
  });

  describe('create user test', () => {
    describe('positive', () => {
      it('should properly create the user', async () => {
        const createUserProps = {
          operator: 'mutation',
          operation: 'createUser',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ email: "usertes@email.com", password: "Password@123", role: ADMIN }',
          },
        };
        const data = await gqlRequest(app, createUserProps, auth.token);

        const { body, error, status } = data;
        expect(body.data.createUser.success).toBeTruthy();
        expect(body.data.createUser.errorMessage).toBeNull();
        expect(error).toBeFalsy();
        expect(status).toEqual(200);
      });
    });

    describe('negative', () => {
      it('should not create the user if email is invalid', async () => {
        const createUserProps = {
          operator: 'mutation',
          operation: 'createUser',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ email: "g", password: "123456", role: CLIENT }',
          },
        };
        const data = await gqlRequest(app, createUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.createUser.success).toBeFalsy();
        expect(body.data.createUser.errorMessage).toEqual(new InvalidEmailError().message);
        expect(status).toEqual(200);
      });

      it('should not create the user if password is short', async () => {
        const password = testHelpers.random.string(4); // >= 6

        const createUserProps = {
          operator: 'mutation',
          operation: 'createUser',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: `{ email: "test@email.com", password: "${password}", role: CLIENT }`,
          },
        };
        const data = await gqlRequest(app, createUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.createUser.success).toBeFalsy();
        expect(body.data.createUser.errorMessage).toEqual(new PasswordTooShortError().message);
        expect(status).toEqual(200);
      });

      it('should not create the user if password is too long', async () => {
        const password = testHelpers.random.string(33); // <= 32

        const createUserProps = {
          operator: 'mutation',
          operation: 'createUser',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: `{ email: "test@email.com", password: "${password}", role: CLIENT }`,
          },
        };
        const data = await gqlRequest(app, createUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.createUser.success).toBeFalsy();
        expect(body.data.createUser.errorMessage).toEqual(new PasswordTooLongError().message);
        expect(status).toEqual(200);
      });

      it('should not create if user already exists', async () => {
        const createUserProps = {
          operator: 'mutation',
          operation: 'createUser',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ email: "admin@email.com", password: "Password@123", role: CLIENT }',
          },
        };
        const data = await gqlRequest(app, createUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.createUser.success).toBeFalsy();
        expect(body.data.createUser.errorMessage).toEqual(new UserAlreadyExistsError().message);
        expect(status).toEqual(200);
      });

      it('should not create if role is invalid', async () => {
        const createUserProps = {
          operator: 'mutation',
          operation: 'createUser',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ email: "admin@email.com", password: "123456", role: SUPER_ADMIN }',
          },
        };
        const data = await gqlRequest(app, createUserProps, auth.token);

        const { body, status } = data;
        expect(body.errors).not.toBeNull();
        expect(body.errors[0].message).toEqual('Value "SUPER_ADMIN" does not exist in "UserRoles" enum.');
        expect(status).toEqual(400);
      });

      it('should not create if password is weak', async () => {
        const createUserProps = {
          operator: 'mutation',
          operation: 'createUser',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ email: "admin@email.com", password: "Password", role: CLIENT }',
          },
        };
        const data = await gqlRequest(app, createUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.createUser.success).toBeFalsy();
        expect(body.data.createUser.errorMessage).toEqual(new PasswordWeakError().message);
        expect(status).toEqual(200);
      });

      it('should not create if generated object id is invalid', async () => {
        jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValueOnce(false);

        const createUserProps = {
          operator: 'mutation',
          operation: 'createUser',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ email: "usertes@email.com", password: "Password@123", role: CLIENT }',
          },
        };
        const data = await gqlRequest(app, createUserProps, auth.token);

        const { body } = data;
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual(new InvalidObjectIdError().message);
      });
    });
  });

  describe('update user test', () => {
    describe('positive', () => {
      it('should properly update the user', async () => {
        const updateUserProps = {
          operator: 'mutation',
          operation: 'updateUser',
          responseFields: ['success', 'errorMessage', 'user { id, email, role }'],
          variables: {
            data: '{ id: "111111111111111111111111", email: "usertest@email.com", password: "Password@123", role: USER }',
          },
        };
        const data = await gqlRequest(app, updateUserProps, auth.token);

        const { body, error } = data;
        expect(body.data.updateUser.success).toBeTruthy();
        expect(body.data.updateUser.errorMessage).toBeNull();
        expect(body.data.updateUser.user).toEqual({
          id: '111111111111111111111111',
          email: 'usertest@email.com',
          role: 'USER',
        });
        expect(error).toBeFalsy();
      });
    });

    describe('negative', () => {
      it('should not update the user if email is invalid', async () => {
        const updateUserProps = {
          operator: 'mutation',
          operation: 'updateUser',
          responseFields: ['success', 'errorMessage', 'user { id, email, role }'],
          variables: {
            data: '{ id: "111111111111111111111111", email: "usertes" }',
          },
        };
        const data = await gqlRequest(app, updateUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.updateUser.success).toBeFalsy();
        expect(body.data.updateUser.errorMessage).toEqual(new InvalidEmailError().message);
        expect(status).toEqual(200);
      });

      it('should not update the user if password is short', async () => {
        const password = testHelpers.random.string(4); // >= 6

        const updateUserProps = {
          operator: 'mutation',
          operation: 'updateUser',
          responseFields: ['success', 'errorMessage', 'user { id, email, role }'],
          variables: {
            data: `{ id: "111111111111111111111111", password: "${password}" }`,
          },
        };
        const data = await gqlRequest(app, updateUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.updateUser.success).toBeFalsy();
        expect(body.data.updateUser.errorMessage).toEqual(new PasswordTooShortError().message);
        expect(status).toEqual(200);
      });

      it('should not update the user if password is too long', async () => {
        const password = testHelpers.random.string(33); // <= 32

        const updateUserProps = {
          operator: 'mutation',
          operation: 'updateUser',
          responseFields: ['success', 'errorMessage', 'user { id, email, role }'],
          variables: {
            data: `{ id: "111111111111111111111111", password: "${password}" }`,
          },
        };
        const data = await gqlRequest(app, updateUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.updateUser.success).toBeFalsy();
        expect(body.data.updateUser.errorMessage).toEqual(new PasswordTooLongError().message);
        expect(status).toEqual(200);
      });

      it('should not update user if email is already taken', async () => {
        const createUserProps = {
          operator: 'mutation',
          operation: 'createUser',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ email: "admin2@email.com", password: "Password@123", role: CLIENT }',
          },
        };
        await gqlRequest(app, createUserProps, auth.token);

        const updateUserProps = {
          operator: 'mutation',
          operation: 'updateUser',
          responseFields: ['success', 'errorMessage', 'user { id, email, role }'],
          variables: {
            data: `{ id: "111111111111111111111111", email: "admin2@email.com", password: "Password@123" }`,
          },
        };
        const data = await gqlRequest(app, updateUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.updateUser.success).toBeFalsy();
        expect(body.data.updateUser.errorMessage).toEqual(new EmailAlreadyTakenError().message);
        expect(status).toEqual(200);
      });

      it('should not update user if role is invalid', async () => {
        const updateUserProps = {
          operator: 'mutation',
          operation: 'updateUser',
          responseFields: ['success', 'errorMessage', 'user { id, email, role }'],
          variables: {
            data: `{ id: "111111111111111111111111", role: SUPER_ADMIN }`,
          },
        };
        const data = await gqlRequest(app, updateUserProps, auth.token);

        const { body, status } = data;
        expect(body.errors).not.toBeNull();
        expect(body.errors[0].message).toEqual('Value "SUPER_ADMIN" does not exist in "UserRoles" enum.');
        expect(status).toEqual(400);
      });

      it('should not create if password is weak', async () => {
        const updateUserProps = {
          operator: 'mutation',
          operation: 'updateUser',
          responseFields: ['success', 'errorMessage', 'user { id, email, role }'],
          variables: {
            data: `{ id: "111111111111111111111111", email: "admin@email.com", password: "Password" }`,
          },
        };
        const data = await gqlRequest(app, updateUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.updateUser.success).toBeFalsy();
        expect(body.data.updateUser.errorMessage).toEqual(new PasswordWeakError().message);
        expect(status).toEqual(200);
      });

      it('should not create if user not found', async () => {
        const updateUserProps = {
          operator: 'mutation',
          operation: 'updateUser',
          responseFields: ['success', 'errorMessage', 'user { id, email, role }'],
          variables: {
            data: `{ id: "111111111111111111111112", email: "admin@email.com" }`,
          },
        };
        const data = await gqlRequest(app, updateUserProps, auth.token);

        const { body, status } = data;
        expect(body.data.updateUser.success).toBeFalsy();
        expect(body.data.updateUser.errorMessage).toEqual(new UserNotFoundError().message);
        expect(status).toEqual(200);
      });
    });
  });

  describe('delete user test', () => {
    describe('positive', () => {
      it('should properly delete the user', async () => {
        const deleteUserProps = {
          operator: 'mutation',
          operation: 'deleteUser',
          responseFields: ['success', 'errorMessage'],
          variables: {
            id: '"111111111111111111111111"',
          },
        };
        const data = await gqlRequest(app, deleteUserProps, auth.token);

        const { body, error } = data;
        expect(body.data.deleteUser.success).toBeTruthy();
        expect(body.data.deleteUser.errorMessage).toBeNull();
        expect(error).toBeFalsy();
      });
    });

    describe('negative', () => {
      it('should not delete the user if does not exists', async () => {
        const deleteUserProps = {
          operator: 'mutation',
          operation: 'deleteUser',
          responseFields: ['success', 'errorMessage'],
          variables: {
            id: '"111111111111111111111112"',
          },
        };
        const data = await gqlRequest(app, deleteUserProps, auth.token);

        const { body } = data;
        expect(body.data.deleteUser.success).toBeFalsy();
        expect(body.data.deleteUser.errorMessage).toEqual(new UserNotFoundError().message);
      });
    });
  });

  describe('find user test', () => {
    describe('positive', () => {
      it('should properly find the user', async () => {
        const findUserProps = {
          operator: 'query',
          operation: 'user',
          responseFields: ['id', 'email', 'role'],
          variables: {
            id: '"111111111111111111111111"',
          },
        };
        const data = await gqlRequest(app, findUserProps, auth.token);

        const { body, error } = data;
        expect(body.data.user).toEqual({
          id: '111111111111111111111111',
          email: 'admin@email.com',
          role: 'ADMIN',
        });
        expect(error).toBeFalsy();
      });
    });

    describe('negative', () => {
      it('should not find the user if does not exists', async () => {
        const findUserProps = {
          operator: 'query',
          operation: 'user',
          responseFields: ['id', 'email', 'role'],
          variables: {
            id: '"111111111111111111111112"',
          },
        };
        const data = await gqlRequest(app, findUserProps, auth.token);

        const { body } = data;
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual(new UserNotFoundError().message);
      });
    });
  });

  describe('find users test', () => {
    describe('positive', () => {
      it('should properly find the users', async () => {
        const findUsersProps = {
          operator: 'query',
          operation: 'users',
          responseFields: ['records', 'hasNext', 'users { id }'],
          variables: {
            pagination: '{ page: 1, limit: 2 }',
          },
        };
        const data = await gqlRequest(app, findUsersProps, auth.token);

        const { body, error } = data;
        expect(body.data.users.records).toEqual(2);
        expect(body.data.users.hasNext).toEqual(false);
        expect(body.data.users.users).toEqual([
          {
            id: '111111111111111111111111',
          },
          {
            id: '222222222222222222222222',
          },
        ]);
        expect(error).toBeFalsy();
      });

      it('should properly find the users paginated', async () => {
        const findUsersProps = {
          operator: 'query',
          operation: 'users',
          responseFields: ['records', 'hasNext', 'users { id }'],
          variables: {
            pagination: '{ page: 1, limit: 1 }',
          },
        };
        const data = await gqlRequest(app, findUsersProps, auth.token);

        const { body, error } = data;
        expect(body.data.users.records).toEqual(2);
        expect(body.data.users.hasNext).toEqual(true);
        expect(body.data.users.users).toEqual([
          {
            id: '111111111111111111111111',
          },
        ]);
        expect(error).toBeFalsy();
      });

      it('should return an empty array when over the limit', async () => {
        const findUsersProps = {
          operator: 'query',
          operation: 'users',
          responseFields: ['records', 'hasNext', 'users { id }'],
          variables: {
            pagination: '{ page: 2, limit: 2 }',
          },
        };
        const data = await gqlRequest(app, findUsersProps, auth.token);

        const { body, error } = data;
        expect(body.data.users.records).toEqual(2);
        expect(body.data.users.hasNext).toEqual(false);
        expect(body.data.users.users.length).toEqual(0);
        expect(error).toBeFalsy();
      });
    });
  });
});
