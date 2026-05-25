import { Request } from "express";
export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    pass: string;
    role?: string;
    tenantId?: number | undefined;
}
export interface RegisterRequest extends Request {
    body: UserData;
}
export interface RegisterUserRequest extends Request {
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
export type UpdateTenantPaylod = Partial<TenantPayload>;
export type UpdateUserPayload = Partial<UserData>;
export interface CreateTenantRequest extends Request {
    body: TenantPayload;
}
export type UpdateTenantRequest = Partial<CreateTenantRequest>;
//# sourceMappingURL=index.d.ts.map