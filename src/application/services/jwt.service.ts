import { env } from '@/core/config/env';
import { IJwtService } from '@/core/contracts';
import { Injectable } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class JwtService<T> implements IJwtService<T> {
  sign(payload: T, expiresIn?: string): string {
    return jsonwebtoken.sign(payload as string | object | Buffer, env.JWT_SECRET, {
      expiresIn: expiresIn ?? '1h',
    });
  }

  verify(token: string): T {
    return jsonwebtoken.verify(token, env.JWT_SECRET) as T;
  }
}
