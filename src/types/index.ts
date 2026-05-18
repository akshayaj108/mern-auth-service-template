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
  };
}
