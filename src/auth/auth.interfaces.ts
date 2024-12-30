import { Request } from 'express';

export interface JwtPayload {
  email: string;
  sub: string;
}

export interface ActiveUserData {
  userId: string;
  email: string;
}

export interface OauthUser {
  email: string;
  firstName: string;
  lastName: string;
}

export interface OauthRequestWithUser extends Request {
  user: OauthUser;
}
