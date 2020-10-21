export interface IUserRole {
    UserRoleId: number,
    UserId: number,
    RoleId: number,
    CreatedDate: Date,
    CreatedBy: string,
    LastChangedDate: Date,
    LastChangedBy: string,
    IsSelected: boolean
}

//export interface IScreenUserRoleName {
//    RoleId: number,
//    CreatedBy: string,
//    UserRoleId: number,
//    IsSelected: boolean,
//    CreatedDate: Date,
//    LastChangedDate: Date,
//    LastChangedBy: string,

//}

//export class IScreenUserRoleNames {
//    RoleId: number;
//    UserId: number;
//    UserRoleId: number;
//    IsSelected: boolean;
//    CreatedDate: Date;
//    CreatedBy: string;
//    LastChangedDate: Date;
//    LastChangedBy: string;

//    constructor(RoleId, UserId, UserRoleId, IsSelected, CreatedDate, CreatedBy, LastChangedDate, LastChangedBy) {
//        this.RoleId = RoleId;
//        this.UserId = UserId;
//        this.UserRoleId = UserRoleId;
//        this.IsSelected = IsSelected;
//        this.CreatedDate = CreatedDate;
//        this.CreatedBy = CreatedBy;
//        this.LastChangedDate = LastChangedDate;
//        this.LastChangedBy = LastChangedBy;
//    }
//}