import { Request } from "express";

export interface JwtPayload {
    _id: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    isAdmin: boolean,
    isSuperAdmin: boolean,
    workspaceID: string,
} 

export interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}
