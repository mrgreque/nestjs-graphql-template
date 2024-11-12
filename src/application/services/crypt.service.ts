import { ICryptService } from '@/core/contracts';
import * as bcrypt from 'bcrypt';

export class CryptService implements ICryptService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
