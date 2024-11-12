import { GenerateTokens, IAuthService, ValidateLogin, VerifyRefreshToken } from '@/core/contracts';
import { Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { CryptService } from './crypt.service';
import { ExpiredRefreshTokenError } from '@/core/errors/session.error';

interface IJwtPayload {
  sub: string;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly jwtService: JwtService<IJwtPayload>, private readonly cryptService: CryptService) {}

  async validateLogin({ user, password }: ValidateLogin.Input): Promise<ValidateLogin.Output> {
    return await this.cryptService.compare(password, user.props.password);
  }

  generateTokens(user: GenerateTokens.Input): GenerateTokens.Output {
    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, '7d');

    return { token, refreshToken };
  }

  verifyRefreshToken({ token }: VerifyRefreshToken.Input): VerifyRefreshToken.Output {
    try {
      const { sub: userId } = this.jwtService.verify(token);
      return { userId };
    } catch (error) {
      throw new ExpiredRefreshTokenError();
    }
  }
}
