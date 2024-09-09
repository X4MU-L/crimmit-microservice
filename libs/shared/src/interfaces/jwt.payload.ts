import { Request } from 'express';

export interface Jwtpayload {
  uid: string;
}

export interface TokenRequest extends Request {
  token?: string;
}
