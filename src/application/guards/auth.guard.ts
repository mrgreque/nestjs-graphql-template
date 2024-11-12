import InvalidObjectIdError from '@/core/@seedwork/domain/errors/invalid-object-id.error';
import { UserAuthFromInexistentUserError, UserUnauthorizedError } from '@/core/errors/session.error';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<any> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    try {
      return await super.canActivate(new ExecutionContextHost([req]));
    } catch (error) {
      if (!req?.headers?.authorization) {
        throw new Error('Authorization header is missing');
      }

      if (
        error instanceof UserUnauthorizedError ||
        error instanceof UserAuthFromInexistentUserError ||
        error instanceof InvalidObjectIdError
      ) {
        throw error;
      }

      throw new Error('Invalid or expired token');
    }
  }
}
