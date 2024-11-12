import { INestApplication } from '@nestjs/common';
import { GenerateGql, generateGql } from './generate-gql';
import * as request from 'supertest';

export async function gqlRequest(
  app: INestApplication,
  props: GenerateGql.Input,
  token?: string,
): Promise<request.Response> {
  const query = generateGql(props);

  return request(app.getHttpServer())
    .post('/graphql')
    .set({
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    })
    .send(query);
}
