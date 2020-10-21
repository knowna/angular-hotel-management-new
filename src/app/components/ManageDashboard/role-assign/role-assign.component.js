"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var enum_1 = require("../../Shared/enum");
var global_1 = require("../../Shared/global");
var RoleAssignmentComponent = /** @class */ (function () {
    function RoleAssignmentComponent(fb, _userRoleService, _roleService, _userService, date, modalService) {
        var _this = this;
        this.fb = fb;
        this._userRoleService = _userRoleService;
        this._roleService = _roleService;
        this._userService = _userService;
        this.date = date;
        this.modalService = modalService;
        this.indLoading = false;
        this._roleService.getRoles().subscribe(function (data) { _this.roleData = data; }),
            this._userService.getUsers().subscribe(function (data) { _this.userData = data; });
    }
    RoleAssignmentComponent.prototype.ngOnInit = function () {
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
    };
    RoleAssignmentComponent.prototype.LoadRoles = function () {
        var _this = this;
        this.indLoading = true;
        this._userRoleService.get(global_1.Global.BASE_USERROLE_ENDPOINT)
            .subscribe(function (userRoles) { _this.userRoles = userRoles; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    RoleAssignmentComponent.prototype.addUserRoles = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add UserRole";
        this.modalBtnTitle = "Add";
        this.UserRoleFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    RoleAssignmentComponent.prototype.editUserRole = function (Id) {
        // ;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit UserRole";
        this.modalBtnTitle = "Update";
        this.userRole = this.userRoles.filter(function (x) { return x.RoleId == Id; })[0];
        this.UserRoleFrm.setValue(this.userRole);
        //this.mo.open();
    };
    RoleAssignmentComponent.prototype.deleteUserRole = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.userRole = this.userRoles.filter(function (x) { return x.RoleId == id; })[0];
        this.UserRoleFrm.setValue(this.userRole);
        // this.modal.open();
    };
    RoleAssignmentComponent.prototype.validateAllFields = function (formGroup) {
        var _this = this;
        Object.keys(formGroup.controls).forEach(function (field) {
            var control = formGroup.get(field);
            if (control instanceof forms_1.FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof forms_1.FormGroup) {
                _this.validateAllFields(control);
            }
        });
    };
    RoleAssignmentComponent.prototype.onSubmit = function () {
        var _this = this;
         ;
        this.msg = "";
        var Role = this.UserRoleFrm;
        this.formSubmitAttempt = true;
        if (Role.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                     ;
                    this._userRoleService.post(global_1.Global.BASE_USERROLE_ENDPOINT, Role.value).subscribe(function (data) {
                        if (data == 1) {
                             ;
                            _this.msg = "Data successfully added.";
                            _this.modalRef.hide();
                            _this.LoadRoles();
                        }
                        else {
                            _this.msg = "There is some issue in saving records, please contact to system administrator!";
                        }
                    });
                    break;
                case enum_1.DBOperation.update:
                     ;
                    this._userRoleService.put(global_1.Global.BASE_USERROLE_ENDPOINT, Role.value.Id, Role.value).subscribe(function (data) {
                        if (data == 2) {
                            _this.msg = "Data successfully added.";
                            _this.modalRef.hide();
                            _this.LoadRoles();
                        }
                        else {
                            _this.msg = "There is some issue in saving records, please contact to system administrator!";
                        }
                    });
            }
        }
        else {
            this.validateAllFields(Role);
        }
    };
    RoleAssignmentComponent.prototype.reset = function () {
        // ;
        var control = this.UserRoleFrm.controls['RoleId'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.UserRoleFrm.reset();
        }
    };
    RoleAssignmentComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.UserRoleFrm.enable() : this.UserRoleFrm.disable();
    };
    __decorate([
        core_1.ViewChild('template')
    ], RoleAssignmentComponent.prototype, "TemplateRef", void 0);
    RoleAssignmentComponent = __decorate([
        core_1.Component({
            templateUrl: './role-assign.component.html'
        })
    ], RoleAssignmentComponent);
    return RoleAssignmentComponent;
}());
exports.RoleAssignmentComponent = RoleAssignmentComponent;
