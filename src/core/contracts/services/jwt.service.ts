export interface IJwtService<T> {
  sign(payload: T, expiresIn?: string): string;
  verify(token: string): T;
}
