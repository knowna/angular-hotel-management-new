export interface IRole {
    RoleId: number,
    RoleName: string,
    Description: string,
    Selected: boolean,
    CreatedOn: Date,
    CreatedBy: string,
    LastChangedDate: Date,
    LastChangedBy: string,
    IsSysAdmin: boolean
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