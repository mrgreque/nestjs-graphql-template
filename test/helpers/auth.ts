import { NestApplication } from '@nestjs/core';
import * as request from 'supertest';
import { print } from 'graphql';
import { gql } from 'apollo-server-core';

export async function defaultLogin(app: NestApplication): Promise<{ token: string; refreshToken: string }> {
  const { body } = await request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: print(gql`
        mutation {
          login(email: "admin@email.com", password: "123456") {
            token
            refreshToken
          }
        }
      `),
    });

  return body.data.login;
}
export async function clientLogin(app: NestApplication): Promise<{ token: string; refreshToken: string }> {
  const { body } = await request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: print(gql`
        mutation {
          login(email: "user@email.com", password: "123456") {
            token
            refreshToken
          }
        }
      `),
    });

  return body.data.login;
}
