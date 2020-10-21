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
var UserComponent = /** @class */ (function () {
    function UserComponent(fb, _userService, modalService) {
        this.fb = fb;
        this._userService = _userService;
        this.modalService = modalService;
        this.indLoading = false;
    }
    UserComponent.prototype.ngOnInit = function () {
        this.userFrm = this.fb.group({
            UserId: [''],
            FullName: ['', forms_1.Validators.required],
            UserName: ['', forms_1.Validators.required],
            Password: ['', forms_1.Validators.required],
            Email: ['', forms_1.Validators.required],
            PhoneNumber: ['', forms_1.Validators.required],
            IsActive: ['',],
            ResetPassword: [''],
        });
        this.LoadUsers();
    };
    UserComponent.prototype.LoadUsers = function () {
        var _this = this;
        this.indLoading = true;
        this._userService.get(global_1.Global.BASE_USERACCOUNT_ENDPOINT)
            .subscribe(function (user) { _this.user = user; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    UserComponent.prototype.addUser = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add User";
        this.modalBtnTitle = "Add";
        this.userFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    UserComponent.prototype.editUser = function (Id) {
         ;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit User";
        this.modalBtnTitle = "Update";
        this.users = this.user.filter(function (x) { return x.UserId == Id; })[0];
        this.userFrm.setValue(this.users);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    UserComponent.prototype.deleteUser = function (Id) {
         ;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete User?";
        this.modalBtnTitle = "Delete";
        this.users = this.user.filter(function (x) { return x.UserId == Id; })[0];
        this.userFrm.setValue(this.users);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    UserComponent.prototype.validateAllFields = function (formGroup) {
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
    UserComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    UserComponent.prototype.onSubmit = function (formData) {
        var _this = this;
         ;
        this.formSubmitAttempt = true;
        this.msg = "";
        var users = this.userFrm;
        if (users.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._userService.post(global_1.Global.BASE_USERACCOUNT_ENDPOINT, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.LoadUsers();
                            _this.formSubmitAttempt = false;
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
                            _this.LoadUsers();
                        }
                        else {
                            _this.msg = "There is some issue in saving records, please contact to system administrator!";
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.delete:
                     ;
                    this._userService.delete(global_1.Global.BASE_USER_ENDPOINT, formData.value.UserId).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "Data successfully deleted.";
                            _this.LoadUsers();
                        }
                        else {
                            _this.msg = "There is some issue in saving records, please contact to system administrator!";
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
            }
        }
        else {
            this.validateAllFields(users);
        }
    };
    UserComponent.prototype.confirm = function () {
        this.modalRef2.hide();
    };
    UserComponent.prototype.reset = function () {
         ;
        var control = this.userFrm.controls['UserId'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.userFrm.reset();
        }
    };
    UserComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    };
    __decorate([
        core_1.ViewChild('template')
    ], UserComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], UserComponent.prototype, "TemplateRef2", void 0);
    UserComponent = __decorate([
        core_1.Component({
            templateUrl: './user.component.html'
        })
    ], UserComponent);
    return UserComponent;
}());
exports.UserComponent = UserComponent;
