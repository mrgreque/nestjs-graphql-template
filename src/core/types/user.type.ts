export interface IUpdateToken {
  token: string;
  refreshToken?: string;
}

export interface ISession {
  token: string;
  refreshToken?: string;
}

export enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
  USER = 'user',
}

export interface IUser {
  id?: string;
  email: string;
  password: string;
  role: Role;
  session?: ISession;
}
