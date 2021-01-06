﻿export interface IRole {
    Id: number,
    RoleName: string,
    Name: string;
    Description: string,
    Selected: boolean,
    CreatedOn: Date,
    CreatedBy: string,
    LastChangedDate: Date,
    LastChangedBy: string,
    IsSysAdmin: boolean,
    IsAdd:boolean,
    IsDelete:boolean,
    IsEdit:boolean,
    IsView:boolean
    PermissionList: string;
}

export interface IScreenRoleName {
    RoleId: number,
    Selected: boolean,
}

export class IScreenRoleNames {
    RoleId: number;
    Selected: boolean;

    constructor(RoleId, Selected) {
        this.RoleId = RoleId;
        this.Selected = Selected;
    }
}