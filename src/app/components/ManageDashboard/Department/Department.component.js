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
var DepartmentComponent = /** @class */ (function () {
    function DepartmentComponent(fb, _departmentService, modalService) {
        this.fb = fb;
        this._departmentService = _departmentService;
        this.modalService = modalService;
        this.indLoading = false;
    }
    DepartmentComponent.prototype.ngOnInit = function () {
        this.DepartFrm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required]
        });
        this.LoadDepartment();
    };
    DepartmentComponent.prototype.LoadDepartment = function () {
        var _this = this;
         ;
        this.indLoading = true;
        this._departmentService.get(global_1.Global.BASE_DEPARTMENT_ENDPOINT)
            .subscribe(function (departments) { _this.departments = departments; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    DepartmentComponent.prototype.openModal = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Department";
        this.modalBtnTitle = "Save";
        this.DepartFrm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    DepartmentComponent.prototype.editDepartment = function (id, template) {
         ;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit DepartmentName";
        this.modalBtnTitle = "Update";
        this.department = this.departments.filter(function (x) { return x.Id == id; })[0];
        this.DepartFrm.setValue(this.department);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    DepartmentComponent.prototype.deleteDepartment = function (id, template) {
         ;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.department = this.departments.filter(function (x) { return x.Id == id; })[0];
        this.DepartFrm.setValue(this.department);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    DepartmentComponent.prototype.validateAllFields = function (formGroup) {
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
    DepartmentComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.formSubmitAttempt = true;
        var departfrm = this.DepartFrm;
        if (departfrm.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._departmentService.post(global_1.Global.BASE_DEPARTMENT_ENDPOINT, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully added.");
                            _this.LoadDepartment();
                            _this.modalRef.hide();
                            _this.formSubmitAttempt = false;
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
                case enum_1.DBOperation.update:
                    this._departmentService.put(global_1.Global.BASE_DEPARTMENT_ENDPOINT,  formData.value.Id, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully updated.");
                            _this.modalRef.hide();
                            _this.LoadDepartment();
                            _this.formSubmitAttempt = false;
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
                case enum_1.DBOperation.delete:
                    this._departmentService.delete(global_1.Global.BASE_DEPARTMENT_ENDPOINT,  formData.value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Department successfully deleted.");
                            _this.modalRef.hide();
                            _this.LoadDepartment();
                            _this.formSubmitAttempt = false;
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        //this.modal.dismiss();
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
            }
        }
        else {
            this.validateAllFields(departfrm);
        }
    };
    DepartmentComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.DepartFrm.enable() : this.DepartFrm.disable();
    };
    DepartmentComponent = __decorate([
        core_1.Component({
            selector: 'my-department-list',
            templateUrl: './Department.component.html'
        })
    ], DepartmentComponent);
    return DepartmentComponent;
}());
exports.DepartmentComponent = DepartmentComponent;
