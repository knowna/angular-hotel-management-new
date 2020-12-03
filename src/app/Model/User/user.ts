import { IUserRole } from './userRole';

export interface IUser {
    Id: number,
    FullName: string,
    FirstName: string,
    LastName: string,
    UserName: string
    Password: string,
    Email: string,
    PhoneNumber: string,
    IsActive: boolean,
    ResetPassword: boolean,
    Token:string,
    Roles:IUserRole[];
    RoleName: string;
    ConfirmPassword: string;
}