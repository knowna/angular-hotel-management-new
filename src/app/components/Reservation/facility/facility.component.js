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
var enum_1 = require("../../../Shared/enum");
var global_1 = require("../../../Shared/global");
var FacilityComponent = /** @class */ (function () {
    function FacilityComponent(fb, _facilityService, modalService) {
        this.fb = fb;
        this._facilityService = _facilityService;
        this.modalService = modalService;
        this.isLoading = false;
    }
    FacilityComponent.prototype.ngOnInit = function () {
        this.facilityForm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required]
        });
        this.LoadFacilitys();
    };
    FacilityComponent.prototype.LoadFacilitys = function () {
        var _this = this;
         ;
        this.isLoading = true;
        this._facilityService.get(global_1.Global.BASE_RESERVATION_FACILITY_ENDPOINT)
            .subscribe(function (facilities) { _this.facilities = facilities; _this.isLoading = false; }, function (error) { return _this.msg = error; });
    };
    FacilityComponent.prototype.openModal = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Room Type";
        this.modalBtnTitle = "Save";
        this.facilityForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    FacilityComponent.prototype.editDepartment = function (id, template) {
         ;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Room Type";
        this.modalBtnTitle = "Update";
        this.facility = this.facilities.filter(function (x) { return x.Id == id; })[0];
        this.facilityForm.setValue(this.facility);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    FacilityComponent.prototype.deleteDepartment = function (id, template) {
         ;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.facility = this.facilities.filter(function (x) { return x.Id == id; })[0];
        this.facilityForm.setValue(this.facility);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    FacilityComponent.prototype.validateAllFields = function (formGroup) {
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
    FacilityComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.formSubmitAttempt = true;
        var departfrm = this.facilityForm;
        if (departfrm.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._facilityService.post(global_1.Global.BASE_RESERVATION_FACILITY_ENDPOINT, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully added.");
                            _this.LoadFacilitys();
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
                    this._facilityService.put(global_1.Global.BASE_RESERVATION_FACILITY_ENDPOINT,  formData.value.Id, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully updated.");
                            _this.modalRef.hide();
                            _this.LoadFacilitys();
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
                    this._facilityService.delete(global_1.Global.BASE_RESERVATION_FACILITY_ENDPOINT,  formData.value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Department successfully deleted.");
                            _this.modalRef.hide();
                            _this.LoadFacilitys();
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
    FacilityComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.facilityForm.enable() : this.facilityForm.disable();
    };
    FacilityComponent = __decorate([
        core_1.Component({
            templateUrl: './facility.component.html'
        })
    ], FacilityComponent);
    return FacilityComponent;
}());
exports.FacilityComponent = FacilityComponent;
