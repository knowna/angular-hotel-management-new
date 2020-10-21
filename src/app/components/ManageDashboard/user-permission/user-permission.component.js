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
var UserPermissionComponent = /** @class */ (function () {
    function UserPermissionComponent(fb, _userService, modalService) {
        this.fb = fb;
        this._userService = _userService;
        this.modalService = modalService;
        this.indLoading = false;
    }
    UserPermissionComponent.prototype.ngOnInit = function () {
        this.userPermissionFrm = this.fb.group({
            UserPermissionId: [''],
            PermissionId: [''],
            UserId: [''],
            PermissionName: ['', forms_1.Validators.required],
            UserFullName: ['', forms_1.Validators.required],
            CreatedDate: ['', forms_1.Validators.required],
            CreatedBy: ['', forms_1.Validators.required],
            LastChangedDate: ['', forms_1.Validators.required],
            LastChangedBy: ['',],
        });
        this.LoadUserPermission();
    };
    UserPermissionComponent.prototype.LoadUserPermission = function () {
        var _this = this;
        this.indLoading = true;
        this._userService.get(global_1.Global.BASE_USERACCOUNT_ENDPOINT)
            .subscribe(function (userPer) { _this.userPer = userPer; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    UserPermissionComponent.prototype.addUserPermission = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New User";
        this.modalBtnTitle = "Add";
        this.userPermissionFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    UserPermissionComponent.prototype.editUserPermission = function (Id) {
         ;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit User";
        this.modalBtnTitle = "Update";
        this.usersPer = this.userPer.filter(function (x) { return x.UserId == Id; })[0];
        this.userPermissionFrm.setValue(this.usersPer);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    UserPermissionComponent.prototype.deleteUserPermission = function (Id) {
         ;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.usersPer = this.userPer.filter(function (x) { return x.UserId == Id; })[0];
        this.userPermissionFrm.setValue(this.usersPer);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    UserPermissionComponent.prototype.validateAllFields = function (formGroup) {
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
    UserPermissionComponent.prototype.onSubmit = function (formData) {
        var _this = this;
         ;
        this.formSubmitAttempt = true;
        this.msg = "";
        var usrPermFrm = this.userPermissionFrm;
        if (usrPermFrm.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._userService.post(global_1.Global.BASE_USERACCOUNT_ENDPOINT, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "Data successfully added.";
                            _this.LoadUserPermission();
                        }
                        else {
                            _this.msg = "There is some issue in saving records, please contact to system administrator!";
                        }
                        _this.modalRef.hide();
                    });
                    break;
                case enum_1.DBOperation.update:
                     ;
                    this._userService.put(global_1.Global.BASE_USERACCOUNT_ENDPOINT, formData.value.UserId, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "Data updated successfully.";
                            _this.LoadUserPermission();
                        }
                        else {
                            _this.msg = "There is some issue in saving records, please contact to system administrator!";
                        }
                        _this.modalRef.hide();
                    });
                    break;
                case enum_1.DBOperation.delete:
                     ;
                    this._userService.delete(global_1.Global.BASE_USER_ENDPOINT, formData.value.UserId).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "Data successfully deleted.";
                            _this.LoadUserPermission();
                        }
                        else {
                            _this.msg = "There is some issue in saving records, please contact to system administrator!";
                        }
                        _this.modalRef.hide();
                    });
            }
        }
        else {
            this.validateAllFields(usrPermFrm);
        }
    };
    UserPermissionComponent.prototype.reset = function () {
         ;
        var control = this.userPermissionFrm.controls['UserId'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.userPermissionFrm.reset();
        }
    };
    UserPermissionComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.userPermissionFrm.enable() : this.userPermissionFrm.disable();
    };
    __decorate([
        core_1.ViewChild('template')
    ], UserPermissionComponent.prototype, "TemplateRef", void 0);
    UserPermissionComponent = __decorate([
        core_1.Component({
            templateUrl: './user-permission.component.html'
        })
    ], UserPermissionComponent);
    return UserPermissionComponent;
}());
exports.UserPermissionComponent = UserPermissionComponent;
