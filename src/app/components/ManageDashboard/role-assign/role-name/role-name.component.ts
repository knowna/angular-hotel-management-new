import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { IRole, IScreenRoleName, IScreenRoleNames } from '../../../../Model/Roles/role';
import { RoleService } from '../../../../Service/role.service';
import { Global } from '../../../../Shared/global';
import { Routes, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { UserRoleService } from '../../../../Service/userRole.service';
import { IUserRole } from '../../../../Model/User/userRole';
import { UsersService } from '../../../../Service/user.service';

@Component({
    templateUrl: './role-name.component.html'
})

export class RoleNameComponent {

    rolesNames: IScreenRoleName[];

    msg: string;
    indLoading: boolean = false;
    RoleNameFrm: FormGroup;
    modalTitle: string;
    modalBtnTitle: string;
    private formSubmitAttempt: boolean;

    constructor(
        private fb: FormBuilder,
        private _roleService: RoleService,
        private _userRoleService: UserRoleService, 
        private _userService: UsersService,
        private route: ActivatedRoute)
    {    }

    ngOnInit(): void {
        this.RoleNameFrm = this.fb.group({
            RoleId: [''],
            Selected: [''],

        });
        this.route.params.subscribe((params: Params) => {
            this.LoadRoleName(params['roleid']);
        });
    }
    
    LoadRoleName(Id: number): void {
         
        this.indLoading = true;
        this._userRoleService.get(Global.BASE_USERROLE_ENDPOINT + Id)
            .subscribe(rolesName => { this.rolesNames = rolesName; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    addNamesToRole(RoleId: number, Selected: boolean ): void {
         
        let RoleScreenNames = new IScreenRoleNames(RoleId, Selected);
        this._userRoleService.post(Global.BASE_USERROLE_ENDPOINT, RoleScreenNames).subscribe(
            data => {
                 
                if (data == 1) {
                    alert("RoleName added successfully");
                }
                else if (data == 2) {
                    alert("RoleName deleted successfully");
                }
                else {
                    alert("There is some issue in saving records, please contact to system administrator!");
                }
            },
            error => {
                this.msg = error;
            }
        );
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.RoleNameFrm.enable() : this.RoleNameFrm.disable();
    }
}