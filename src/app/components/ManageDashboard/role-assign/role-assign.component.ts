import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { IUser } from '../../../Model/User/user';
import { IUserRole } from '../../../Model/User/userRole';
import { RoleService } from '../../../Service/role.service';
import { UsersService } from '../../../Service/user.service';
import { UserRoleService } from '../../../Service/userRole.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';

@Component({
    templateUrl: './role-assign.component.html'
})
export class RoleAssignmentComponent implements OnInit {
    @ViewChild('template',{static:false}) TemplateRef: TemplateRef<any>;
    modalRef: BsModalRef;
    userRoles: IUserRole[];
    userRole: IUserRole;
    user: IUser[];
    msg: string;
    indLoading: boolean = false;
    UserRoleFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean; 
    formattedDate: any;

    constructor(
        private fb: FormBuilder, 
        private _userRoleService: UserRoleService, 
        private _roleService: RoleService, 
        private _userService: UsersService, 
        private date: DatePipe, 
        private modalService: BsModalService
    ) {
            this._userService.getUsers().subscribe(data => { this.user.join(data['user']) })
    }

    ngOnInit(): void {
        this.UserRoleFrm = this.fb.group({
            UserRoleId: [''],
            UserId: [''],
            RoleId: [''],
            CreatedDate: [''],
            CreatedBy: [''],
            LastChangedDate: [''],
            LastChangedBy: [''],
            IsSelected: ['']
        });
        this.LoadRoles();
    }

    LoadRoles(): void {
        this.indLoading = true;
        this._userRoleService.get(Global.BASE_USERROLE_ENDPOINT)
            .subscribe(userRoles => { this.userRoles = userRoles; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    addUserRoles() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add User Role";
        this.modalBtnTitle = "Add";
        this.UserRoleFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
        });
    }

    editUserRole(Id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit User Role";
        this.modalBtnTitle = "Update";
        this.userRole = this.userRoles.filter(x => x.RoleId == Id)[0];
        this.UserRoleFrm.setValue(this.userRole);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    }

    deleteUserRole(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.userRole = this.userRoles.filter(x => x.RoleId == id)[0];
        this.UserRoleFrm.setValue(this.userRole);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    }

    validateAllFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFields(control);
            }
        });
    }

    onSubmit() {
         ;
        this.msg = "";
        let Role = this.UserRoleFrm;
        this.formSubmitAttempt = true;

        if (Role.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                     ;
                    this._userRoleService.post(Global.BASE_USERROLE_ENDPOINT, Role.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                 ;
                                this.msg = "Data successfully added.";
                                this.modalRef.hide();
                                this.LoadRoles();
                            } else {
                                this.msg = "There is some issue in creating records, please contact to system administrator!"
                            }
                        },
                    );
                    break;
                case DBOperation.update:
                     ;
                    this._userRoleService.put(Global.BASE_USERROLE_ENDPOINT, Role.value.Id, Role.value).subscribe(
                        data => {
                            if (data == 2) //Success
                            {
                                this.msg = "Data successfully added.";
                                this.modalRef.hide();
                                this.LoadRoles();
                            } else {
                                this.msg = "There is some issue in saving records, please contact to system administrator!"
                            }
                        },
                    )
            }
        } else {
            this.validateAllFields(Role);
        }
    }

    reset() {
        let control = this.UserRoleFrm.controls['RoleId'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        } else {
            this.UserRoleFrm.reset();
        }
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.UserRoleFrm.enable() : this.UserRoleFrm.disable();
    }
}
