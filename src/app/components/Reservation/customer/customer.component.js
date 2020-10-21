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
var ReservationCustomerComponent = /** @class */ (function () {
    function ReservationCustomerComponent(fb, _customerService, modalService, date) {
        this.fb = fb;
        this._customerService = _customerService;
        this.modalService = modalService;
        this.date = date;
        this.isLoading = false;
    }
    ReservationCustomerComponent.prototype.ngOnInit = function () {
        this.customerForm = this.fb.group({
            Id: [''],
            Title: [''],
            FirstName: [''],
            MiddleName: [''],
            LastName: [''],
            Email: [''],
            MobileNumber: [''],
            Country: [''],
            CustomerTypeId: [''],
            MemberId: ['1001'],
            MemberSince: ['']
        });
        this.LoadCustomers();
    };
    ReservationCustomerComponent.prototype.LoadCustomers = function () {
        var _this = this;
        this.isLoading = true;
        this._customerService.get(global_1.Global.BASE_CUSTOMER_TYPES_ENDPOINT)
            .subscribe(function (customerTypes) { _this.customers = customerTypes; _this.isLoading = false; }, function (error) { return _this.msg = error; });
        this._customerService.get(global_1.Global.BASE_RESERVATION_CUSTOMER_ENDPOINT)
            .subscribe(function (customers) {
            _this.customers = customers;
            _this.isLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    ReservationCustomerComponent.prototype.openModal = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Customer";
        this.modalBtnTitle = "Save";
        this.customerForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    ReservationCustomerComponent.prototype.editDepartment = function (id, template) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Customer";
        this.modalBtnTitle = "Update";
        this.customer = this.customers.filter(function (x) { return x.Id == id; })[0];
        this.customerForm.controls.Id.setValue(this.customer.Id);
        this.customerForm.controls.Title.setValue(this.customer.Title);
        this.customerForm.controls.FirstName.setValue(this.customer.FirstName);
        this.customerForm.controls.MiddleName.setValue(this.customer.MiddleName);
        this.customerForm.controls.LastName.setValue(this.customer.LastName);
        this.customerForm.controls.Email.setValue(this.customer.Email);
        this.customerForm.controls.MobileNumber.setValue(this.customer.MobileNumber);
        this.customerForm.controls.Country.setValue(this.customer.Country);
        this.customerForm.controls.CustomerTypeId.setValue(this.customer.CustomerTypeId);
        this.customerForm.controls.MemberId.setValue(this.customer.MemberId);
        this.customerForm.controls.MemberSince.setValue(new Date(this.customer.MemberSince));
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    ReservationCustomerComponent.prototype.deleteDepartment = function (id, template) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.customer = this.customers.filter(function (x) { return x.Id == id; })[0];
        this.customerForm.controls.Id.setValue(this.customer.Id);
        this.customerForm.controls.Title.setValue(this.customer.Title);
        this.customerForm.controls.FirstName.setValue(this.customer.FirstName);
        this.customerForm.controls.MiddleName.setValue(this.customer.MiddleName);
        this.customerForm.controls.LastName.setValue(this.customer.LastName);
        this.customerForm.controls.Email.setValue(this.customer.Email);
        this.customerForm.controls.MobileNumber.setValue(this.customer.MobileNumber);
        this.customerForm.controls.Country.setValue(this.customer.Country);
        this.customerForm.controls.CustomerTypeId.setValue(this.customer.CustomerTypeId);
        this.customerForm.controls.MemberId.setValue(this.customer.MemberId);
        this.customerForm.controls.MemberSince.setValue(new Date(this.customer.MemberSince));
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    ReservationCustomerComponent.prototype.validateAllFields = function (formGroup) {
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
    ReservationCustomerComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.formSubmitAttempt = true;
        var departfrm = this.customerForm;
         ;
        if (departfrm.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._customerService.post(global_1.Global.BASE_RESERVATION_CUSTOMER_ENDPOINT, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully added.");
                            _this.LoadCustomers();
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
                    this._customerService.put(global_1.Global.BASE_RESERVATION_CUSTOMER_ENDPOINT,  formData.value.Id, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully updated.");
                            _this.modalRef.hide();
                            _this.LoadCustomers();
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
                    this._customerService.delete(global_1.Global.BASE_RESERVATION_CUSTOMER_ENDPOINT,  formData.value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Department successfully deleted.");
                            _this.modalRef.hide();
                            _this.LoadCustomers();
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
    ReservationCustomerComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.customerForm.enable() : this.customerForm.disable();
    };
    ReservationCustomerComponent = __decorate([
        core_1.Component({
            templateUrl: './customer.component.html'
        })
    ], ReservationCustomerComponent);
    return ReservationCustomerComponent;
}());
exports.ReservationCustomerComponent = ReservationCustomerComponent;
