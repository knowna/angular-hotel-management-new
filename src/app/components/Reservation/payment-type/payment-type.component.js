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
var PaymentTypeComponent = /** @class */ (function () {
    function PaymentTypeComponent(fb, _paymentTypeService, modalService) {
        this.fb = fb;
        this._paymentTypeService = _paymentTypeService;
        this.modalService = modalService;
        this.isLoading = false;
    }
    PaymentTypeComponent.prototype.ngOnInit = function () {
        this.paymentTypeForm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required]
        });
        this.LoadPaymentTypes();
    };
    PaymentTypeComponent.prototype.LoadPaymentTypes = function () {
        var _this = this;
        debugger;
        this.isLoading = true;
        this._paymentTypeService.get(global_1.Global.BASE_PAYMENT_TYPES_ENDPOINT)
            .subscribe(function (paymentTypes) { _this.paymentTypes = paymentTypes; _this.isLoading = false; }, function (error) { return _this.msg = error; });
    };
    PaymentTypeComponent.prototype.openModal = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Payment Type";
        this.modalBtnTitle = "Save";
        this.paymentTypeForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    PaymentTypeComponent.prototype.editDepartment = function (id, template) {
        debugger;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Payment Type";
        this.modalBtnTitle = "Update";
        this.paymentType = this.paymentTypes.filter(function (x) { return x.Id == id; })[0];
        this.paymentTypeForm.setValue(this.paymentType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    PaymentTypeComponent.prototype.deleteDepartment = function (id, template) {
        debugger;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.paymentType = this.paymentTypes.filter(function (x) { return x.Id == id; })[0];
        this.paymentTypeForm.setValue(this.paymentType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    PaymentTypeComponent.prototype.validateAllFields = function (formGroup) {
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
    PaymentTypeComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.formSubmitAttempt = true;
        var departfrm = this.paymentTypeForm;
        if (departfrm.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._paymentTypeService.post(global_1.Global.BASE_PAYMENT_TYPES_ENDPOINT, formData._value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully added.");
                            _this.LoadPaymentTypes();
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
                    this._paymentTypeService.put(global_1.Global.BASE_PAYMENT_TYPES_ENDPOINT, formData._value.Id, formData._value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully updated.");
                            _this.modalRef.hide();
                            _this.LoadPaymentTypes();
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
                    this._paymentTypeService.delete(global_1.Global.BASE_PAYMENT_TYPES_ENDPOINT, formData._value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Department successfully deleted.");
                            _this.modalRef.hide();
                            _this.LoadPaymentTypes();
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
    PaymentTypeComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.paymentTypeForm.enable() : this.paymentTypeForm.disable();
    };
    PaymentTypeComponent = __decorate([
        core_1.Component({
            templateUrl: './payment-type.component.html'
        })
    ], PaymentTypeComponent);
    return PaymentTypeComponent;
}());
exports.PaymentTypeComponent = PaymentTypeComponent;
