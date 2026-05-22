import { Request } from "express";
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  pass: string;
}
export interface RegisterRequest extends Request {
  body: UserData;
}

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id?: string;
  };
}
export interface IRefreshTokenPayload {
  id: string;
}
export interface TenantPayload {
  name: string;
  address: string;
}

export interface CreateTenantRequest extends Request {
  body: TenantPayload;
}
