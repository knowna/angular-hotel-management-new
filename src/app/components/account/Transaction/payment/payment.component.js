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
var PaymentComponent = /** @class */ (function () {
    function PaymentComponent(fb, _journalvoucherService, _accountTransValues, date, modalService) {
        var _this = this;
        this.fb = fb;
        this._journalvoucherService = _journalvoucherService;
        this._accountTransValues = _accountTransValues;
        this.date = date;
        this.modalService = modalService;
        this.indLoading = false;
        this._journalvoucherService.getAccounts().subscribe(function (data) { _this.account = data; });
        this.fromDate = new Date(2018, 0, 1);
        this.toDate = new Date(2018, 11, 31);
    }
    PaymentComponent.prototype.ngOnInit = function () {
        this.paymentFrm = this.fb.group({
            Id: [''],
            Name: [''],
            AccountTransactionDocumentId: [''],
            Description: [''],
            Amount: [''],
            Date: [''],
            drTotal: [''],
            crTotal: [''],
            SourceAccountTypeId: [''],
            AccountTransactionValues: this.fb.array([
                this.initAccountValue(),
            ]),
        });
        this.loadPaymentList();
    };
    PaymentComponent.prototype.loadPaymentList = function () {
        var _this = this;
        debugger;
        this.indLoading = true;
        this._journalvoucherService.get(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 6)
            .subscribe(function (paymentList) { _this.paymentList = paymentList; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    PaymentComponent.prototype.addPayment = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Payment";
        this.modalBtnTitle = "Save";
        this.paymentFrm.reset();
        this.paymentFrm.controls['Name'].setValue('Payment');
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    /**
     * Gets individual journal voucher
     * @param Id
     */
    PaymentComponent.prototype.getJournalVoucher = function (Id) {
        this.indLoading = true;
        return this._journalvoucherService.get(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT + '?TransactionId=' + Id);
    };
    PaymentComponent.prototype.editPayment = function (Id) {
        var _this = this;
        debugger;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Payment";
        this.modalBtnTitle = "Update";
        this.getJournalVoucher(Id)
            .subscribe(function (payment) {
            _this.indLoading = false;
            _this.paymentFrm.controls['Id'].setValue(payment.Id);
            _this.paymentFrm.controls['Name'].setValue(payment.Name);
            _this.paymentFrm.controls['AccountTransactionDocumentId'].setValue(payment.AccountTransactionDocumentId);
            _this.paymentFrm.controls['SourceAccountTypeId'].setValue(payment.SourceAccountTypeId);
            _this.paymentFrm.controls['Description'].setValue(payment.Description);
            _this.formattedDate = payment.AccountTransactionValues[0]['Date'];
            _this.paymentFrm.controls['Date'].setValue(_this.formattedDate);
            _this.paymentFrm.controls['AccountTransactionValues'] = _this.fb.array([]);
            var control = _this.paymentFrm.controls['AccountTransactionValues'];
            for (var i = 0; i < payment.AccountTransactionValues.length; i++) {
                control.push(_this.fb.group(payment.AccountTransactionValues[i]));
            }
            _this.modalRef = _this.modalService.show(_this.TemplateRef, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-lg'
            });
        }, function (error) { return _this.msg = error; });
    };
    PaymentComponent.prototype.deletePayment = function (Id) {
        var _this = this;
        debugger;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Delete Payment";
        this.modalBtnTitle = "Delete";
        this.getJournalVoucher(Id)
            .subscribe(function (payment) {
            _this.indLoading = false;
            _this.paymentFrm.controls['Id'].setValue(payment.Id);
            _this.paymentFrm.controls['Name'].setValue(payment.Name);
            _this.paymentFrm.controls['AccountTransactionDocumentId'].setValue(payment.AccountTransactionDocumentId);
            _this.paymentFrm.controls['SourceAccountTypeId'].setValue(payment.SourceAccountTypeId);
            _this.paymentFrm.controls['Description'].setValue(payment.Description);
            _this.formattedDate = payment.AccountTransactionValues[0]['Date'];
            _this.paymentFrm.controls['Date'].setValue(_this.formattedDate);
            _this.paymentFrm.controls['Date'].setValue(_this.formattedDate);
            _this.paymentFrm.controls['AccountTransactionValues'] = _this.fb.array([]);
            var control = _this.paymentFrm.controls['AccountTransactionValues'];
            for (var i = 0; i < payment.AccountTransactionValues.length; i++) {
                control.push(_this.fb.group(payment.AccountTransactionValues[i]));
            }
            _this.modalRef = _this.modalService.show(_this.TemplateRef, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-lg'
            });
        }, function (error) { return _this.msg = error; });
    };
    PaymentComponent.prototype.initAccountValue = function () {
        //initialize our vouchers
        return this.fb.group({
            AccountId: ['', forms_1.Validators.required],
            Debit: ['', forms_1.Validators.required],
            Credit: [''],
        });
    };
    //Push the Account Values in row//
    PaymentComponent.prototype.addAccountValues = function () {
        var control = this.paymentFrm.controls['AccountTransactionValues'];
        var addPayment = this.initAccountValue();
        control.push(addPayment);
    };
    //remove the rows//
    PaymentComponent.prototype.removeAccount = function (i, Id) {
        debugger;
        var control = this.paymentFrm.controls['AccountTransactionValues'];
        if (i > 0) {
            this._accountTransValues.delete(global_1.Global.BASE_JOURNAL_ENDPOINT, Id).subscribe(function (data) {
                if (data == 1) {
                    control.removeAt(i);
                }
            });
        }
        else {
            alert("Form requires at least one row");
        }
    };
    //Calculate the sum of debit columns//
    PaymentComponent.prototype.sumDebit = function () {
        var controls = this.paymentFrm.controls.AccountTransactionValues.value;
        return controls.reduce(function (total, accounts) {
            return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
        }, 0);
    };
    //Calculate the sum of credit columns//
    PaymentComponent.prototype.sumCredit = function () {
        var controls = this.paymentFrm.controls.AccountTransactionValues.value;
        return controls.reduce(function (total, accounts) {
            return (accounts.Credit) ? (total + Math.round(accounts.Credit)) : total;
        }, 0);
    };
    PaymentComponent.prototype.validateAllFields = function (formGroup) {
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
    //opens the confirmation window  modal
    PaymentComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    //Submits the form//
    PaymentComponent.prototype.onSubmit = function () {
        var _this = this;
        this.msg = "";
        var payment = this.paymentFrm;
        this.formSubmitAttempt = true;
        if (payment.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    debugger;
                    this._journalvoucherService.post(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT, payment.value).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadPaymentList();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.update:
                    debugger;
                    var paymentObj = {
                        Id: this.paymentFrm.controls['Id'].value,
                        Date: this.paymentFrm.controls['Date'].value,
                        Name: this.paymentFrm.controls['Name'].value,
                        SourceAccountTypeId: this.paymentFrm.controls['SourceAccountTypeId'].value,
                        AccountTransactionDocumentId: this.paymentFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.paymentFrm.controls['Description'].value,
                        AccountTransactionValues: this.paymentFrm.controls['AccountTransactionValues'].value
                    };
                    this._journalvoucherService.put(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT, payment.value.Id, paymentObj).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadPaymentList();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.delete:
                    debugger;
                    var paymentObject = {
                        Id: this.paymentFrm.controls['Id'].value,
                        Date: this.paymentFrm.controls['Date'].value,
                        Name: this.paymentFrm.controls['Name'].value,
                        SourceAccountTypeId: this.paymentFrm.controls['SourceAccountTypeId'].value,
                        AccountTransactionDocumentId: this.paymentFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.paymentFrm.controls['Description'].value,
                        AccountTransactionValues: this.paymentFrm.controls['AccountTransactionValues'].value
                    };
                    this._journalvoucherService.delete(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT, paymentObject).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully deleted.");
                            _this.loadPaymentList();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
            }
        }
        else {
            this.validateAllFields(payment);
        }
    };
    PaymentComponent.prototype.confirm = function () {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    };
    PaymentComponent.prototype.reset = function () {
        var control = this.paymentFrm.controls["Id"].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.paymentFrm.controls['AccountTransactionDocumentId'].reset();
            this.paymentFrm.controls['Date'].reset();
            this.paymentFrm.controls['Description'].reset();
            this.paymentFrm.controls['SourceAccountTypeId'].reset();
            this.paymentFrm.controls['AccountTransactionValues'].reset();
        }
    };
    PaymentComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.paymentFrm.enable() : this.paymentFrm.disable();
    };
    /**
     *  Get the list of filtered journals by the form and to date
     */
    PaymentComponent.prototype.filterPaymentsByDate = function () {
        var _this = this;
        this.indLoading = true;
        this._journalvoucherService.get(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 6)
            .subscribe(function (paymentList) {
            _this.paymentList = paymentList;
            _this.indLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    __decorate([
        core_1.ViewChild('template')
    ], PaymentComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], PaymentComponent.prototype, "TemplateRef2", void 0);
    PaymentComponent = __decorate([
        core_1.Component({
            templateUrl: './payment.component.html',
            styleUrls: ['./payment.component.css']
        })
    ], PaymentComponent);
    return PaymentComponent;
}());
exports.PaymentComponent = PaymentComponent;
