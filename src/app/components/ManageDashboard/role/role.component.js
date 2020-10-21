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
var RoleComponent = /** @class */ (function () {
    function RoleComponent(fb, _roleService, date, modalService) {
        this.fb = fb;
        this._roleService = _roleService;
        this.date = date;
        this.modalService = modalService;
        this.indLoading = false;
    }
    RoleComponent.prototype.ngOnInit = function () {
        this.RoleFrm = this.fb.group({
            RoleId: [''],
            RoleName: ['', forms_1.Validators.required],
            Description: ['', forms_1.Validators.required],
            CreatedOn: [''],
            CreatedBy: [''],
            LastChangedDate: [''],
            LastChangedBy: [''],
            Selected: [''],
            IsSysAdmin: ['']
        });
        this.LoadRoles();
    };
    RoleComponent.prototype.LoadRoles = function () {
        var _this = this;
        this.indLoading = true;
        this._roleService.get(global_1.Global.BASE_ROLES_ENDPOINT)
            .subscribe(function (roles) { _this.roles = roles; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    RoleComponent.prototype.addRoles = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add UserRole";
        this.modalBtnTitle = "Add";
        this.RoleFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    RoleComponent.prototype.editUserRole = function (Id) {
         ;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit UserRole";
        this.modalBtnTitle = "Update";
        this.role = this.roles.filter(function (x) { return x.RoleId == Id; })[0];
        this.RoleFrm.setValue(this.role);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    RoleComponent.prototype.deleteUserRole = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.role = this.roles.filter(function (x) { return x.RoleId == id; })[0];
        this.RoleFrm.setValue(this.role);
        // this.modal.open();
    };
    RoleComponent.prototype.validateAllFields = function (formGroup) {
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
    RoleComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    RoleComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        var Role = this.RoleFrm;
        this.formSubmitAttempt = true;
        if (Role.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._roleService.post(global_1.Global.BASE_ROLES_ENDPOINT, formData.value).subscribe(function (data) {
                        if (data == 1) {
                             ;
                            _this.openModal2(_this.TemplateRef2);
                            _this.LoadRoles();
                        }
                        else {
                            _this.msg = "There is some issue in saving records, please contact to system administrator!";
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.update:
                     ;
                    this._roleService.put(global_1.Global.BASE_ROLES_ENDPOINT, formData.value.RoleId, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "Data successfully updated.";
                            _this.LoadRoles();
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
            this.validateAllFields(Role);
        }
    };
    RoleComponent.prototype.confirm = function () {
        this.modalRef2.hide();
    };
    RoleComponent.prototype.reset = function () {
        var control = this.RoleFrm.controls['RoleId'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.RoleFrm.reset();
        }
    };
    RoleComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.RoleFrm.enable() : this.RoleFrm.disable();
    };
    __decorate([
        core_1.ViewChild('template')
    ], RoleComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], RoleComponent.prototype, "TemplateRef2", void 0);
    RoleComponent = __decorate([
        core_1.Component({
            templateUrl: './role.component.html'
        })
    ], RoleComponent);
    return RoleComponent;
}());
exports.RoleComponent = RoleComponent;
