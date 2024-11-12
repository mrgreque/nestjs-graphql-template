import { app, testContext } from './test-context';
import { seedMongoDb } from './seeds/mongo.seeder';
import { gqlRequest } from './helpers/e2e/request-gql';
import * as jsonwebtoken from 'jsonwebtoken';
import { UserNotFoundError } from '@/core/errors';
import {
  ExpiredRefreshTokenError,
  LoginOrPasswordInvalidError,
  UserAuthFromInexistentUserError,
  UserUnauthorizedError,
} from '@/core/errors/session.error';
import { clientLogin, defaultLogin } from './helpers/auth';

testContext('create login test', (_) => {
  let clientAuth = {
    token: '',
    refreshToken: '',
  };

  beforeEach(async () => {
    await seedMongoDb();
    clientAuth = await clientLogin(app);
  });

  describe('create login test', () => {
    describe('positive', () => {
      it('should login', async () => {
        const { token, refreshToken } = await defaultLogin(app);

        expect(token).toBeDefined();
        expect(refreshToken).toBeDefined();

        const decodedToken = jsonwebtoken.decode(token);
        expect(decodedToken).toBeDefined();
        expect(decodedToken).toHaveProperty('sub');
        expect(decodedToken).toHaveProperty('iat');
        expect(decodedToken).toHaveProperty('exp');
        expect(decodedToken.sub).toEqual('111111111111111111111111');

        const decodedRefreshToken = jsonwebtoken.decode(refreshToken);
        expect(decodedRefreshToken).toBeDefined();
        expect(decodedRefreshToken).toHaveProperty('sub');
        expect(decodedRefreshToken).toHaveProperty('iat');
        expect(decodedRefreshToken).toHaveProperty('exp');
        expect(decodedRefreshToken.sub).toEqual('111111111111111111111111');
      });
    });

    describe('negative', () => {
      it('should not login because user does not exist', async () => {
        const loginProps = {
          operator: 'mutation',
          operation: 'login',
          responseFields: ['token', 'refreshToken'],
          variables: {
            email: `"invalid@email.com"`,
            password: `"123456"`,
          },
        };

        const { body } = await gqlRequest(app, loginProps);
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual(new UserNotFoundError().message);
      });

      it('should not login because password is not matching', async () => {
        const loginProps = {
          operator: 'mutation',
          operation: 'login',
          responseFields: ['token', 'refreshToken'],
          variables: {
            email: `"admin@email.com"`,
            password: `"1234567"`,
          },
        };

        const { body } = await gqlRequest(app, loginProps);
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual(new LoginOrPasswordInvalidError().message);
      });
    });
  });

  describe('create auth guard test', () => {
    describe('negative', () => {
      it('should not create the application if not authenticated', async () => {
        const createApplicationProps = {
          operator: 'mutation',
          operation: 'createApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ name: "New Test Application" }',
          },
        };
        const data = await gqlRequest(app, createApplicationProps);

        const { body } = data;
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual('Authorization header is missing');
      });

      it('should not create the application if user does not have permission', async () => {
        const createApplicationProps = {
          operator: 'mutation',
          operation: 'createApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ name: "New Test Application" }',
          },
        };
        const data = await gqlRequest(app, createApplicationProps, clientAuth.token);

        const { body } = data;
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual(new UserUnauthorizedError().message);
      });

      it('should not create the application if token user is invalid', async () => {
        const createApplicationProps = {
          operator: 'mutation',
          operation: 'createApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ name: "New Test Application" }',
          },
        };
        const invalidToken = jsonwebtoken.sign({ sub: '67216aa9c58aeb277b018c76' }, process.env.JWT_SECRET);
        const data = await gqlRequest(app, createApplicationProps, invalidToken);

        const { body } = data;
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual(new UserAuthFromInexistentUserError().message);
      });

      it('should not create the application if token is expired', async () => {
        const createApplicationProps = {
          operator: 'mutation',
          operation: 'createApplication',
          responseFields: ['success', 'errorMessage'],
          variables: {
            data: '{ name: "New Test Application" }',
          },
        };
        const invalidToken = jsonwebtoken.sign(
          { sub: '111111111111111111111111', exp: Math.floor(Date.now() / 1000) - 60 * 60 },
          process.env.JWT_SECRET,
        );
        const data = await gqlRequest(app, createApplicationProps, invalidToken);

        const { body } = data;
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual('Invalid or expired token');
      });
    });
  });

  describe('create refresh token test', () => {
    describe('positive', () => {
      it('should refresh token', async () => {
        const refreshTokenProps = {
          operator: 'mutation',
          operation: 'refreshToken',
          responseFields: ['token', 'refreshToken'],
          variables: {
            token: `"${clientAuth.refreshToken}"`,
          },
        };

        const { body } = await gqlRequest(app, refreshTokenProps);
        expect(body.data.refreshToken.token).toBeDefined();
        expect(body.data.refreshToken.refreshToken).toBeDefined();
      });
    });

    describe('negative', () => {
      it('should not refresh token if refresh token is invalid', async () => {
        const refreshTokenProps = {
          operator: 'mutation',
          operation: 'refreshToken',
          responseFields: ['token', 'refreshToken'],
          variables: {
            token: `"invalid"`,
          },
        };

        const { body } = await gqlRequest(app, refreshTokenProps);
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual(new ExpiredRefreshTokenError().message);
      });

      it('should not refresh token if refresh token is expired', async () => {
        const expiredToken = jsonwebtoken.sign(
          { sub: '111111111111111111111111', exp: Math.floor(Date.now() / 1000) - 60 * 60 },
          process.env.JWT_SECRET,
        );
        const createApplicationProps = {
          operator: 'mutation',
          operation: 'refreshToken',
          responseFields: ['token', 'refreshToken'],
          variables: {
            token: `"${expiredToken}"`,
          },
        };
        const data = await gqlRequest(app, createApplicationProps);

        const { body } = data;
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual(new ExpiredRefreshTokenError().message);
      });

      it('should not refresh token if user not found', async () => {
        const invalidUserToken = jsonwebtoken.sign(
          { sub: '333333333333333333333333', exp: Math.floor(Date.now() / 1000) + 60 * 60 },
          process.env.JWT_SECRET,
        );

        const createApplicationProps = {
          operator: 'mutation',
          operation: 'refreshToken',
          responseFields: ['token', 'refreshToken'],
          variables: {
            token: `"${invalidUserToken}"`,
          },
        };
        const data = await gqlRequest(app, createApplicationProps);

        const { body } = data;
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toEqual(new UserNotFoundError().message);
      });
    });
  });
});
