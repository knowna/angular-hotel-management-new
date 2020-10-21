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
var ReservationTypeComponent = /** @class */ (function () {
    function ReservationTypeComponent(fb, _reservationTypeService, modalService) {
        this.fb = fb;
        this._reservationTypeService = _reservationTypeService;
        this.modalService = modalService;
        this.isLoading = false;
    }
    ReservationTypeComponent.prototype.ngOnInit = function () {
        this.reservationTypeForm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required]
        });
        this.LoadReservationTypes();
    };
    ReservationTypeComponent.prototype.LoadReservationTypes = function () {
        var _this = this;
         ;
        this.isLoading = true;
        this._reservationTypeService.get(global_1.Global.BASE_RESERVATION_TYPES_ENDPOINT)
            .subscribe(function (reservationTypes) { _this.reservationTypes = reservationTypes; _this.isLoading = false; }, function (error) { return _this.msg = error; });
    };
    ReservationTypeComponent.prototype.openModal = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Reservation Type";
        this.modalBtnTitle = "Save";
        this.reservationTypeForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    ReservationTypeComponent.prototype.editDepartment = function (id, template) {
         ;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Reservation Type";
        this.modalBtnTitle = "Update";
        this.reservationType = this.reservationTypes.filter(function (x) { return x.Id == id; })[0];
        this.reservationTypeForm.setValue(this.reservationType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    ReservationTypeComponent.prototype.deleteDepartment = function (id, template) {
         ;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.reservationType = this.reservationTypes.filter(function (x) { return x.Id == id; })[0];
        this.reservationTypeForm.setValue(this.reservationType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    ReservationTypeComponent.prototype.validateAllFields = function (formGroup) {
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
    ReservationTypeComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.formSubmitAttempt = true;
        var departfrm = this.reservationTypeForm;
        if (departfrm.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._reservationTypeService.post(global_1.Global.BASE_RESERVATION_TYPES_ENDPOINT, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully added.");
                            _this.LoadReservationTypes();
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
                    this._reservationTypeService.put(global_1.Global.BASE_RESERVATION_TYPES_ENDPOINT,  formData.value.Id, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully updated.");
                            _this.modalRef.hide();
                            _this.LoadReservationTypes();
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
                    this._reservationTypeService.delete(global_1.Global.BASE_RESERVATION_TYPES_ENDPOINT,  formData.value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Department successfully deleted.");
                            _this.modalRef.hide();
                            _this.LoadReservationTypes();
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
    ReservationTypeComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.reservationTypeForm.enable() : this.reservationTypeForm.disable();
    };
    ReservationTypeComponent = __decorate([
        core_1.Component({
            templateUrl: './reservation-type.component.html'
        })
    ], ReservationTypeComponent);
    return ReservationTypeComponent;
}());
exports.ReservationTypeComponent = ReservationTypeComponent;
