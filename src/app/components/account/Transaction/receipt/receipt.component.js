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
var ReceiptComponent = /** @class */ (function () {
    /**
     * Receipt Constructor
     *
     * @param fb
     * @param _journalvoucherService
     * @param _accountTransValues
     * @param date
     * @param modalService
     */
    function ReceiptComponent(fb, _journalvoucherService, _accountTransValues, date, modalService) {
        var _this = this;
        this.fb = fb;
        this._journalvoucherService = _journalvoucherService;
        this._accountTransValues = _accountTransValues;
        this.date = date;
        this.modalService = modalService;
        this.inLoading = false;
        this.fromDate = new Date(2018, 0, 1);
        this.toDate = new Date(2018, 11, 31);
        this._journalvoucherService.getAccounts().subscribe(function (data) { _this.account = data; });
    }
    /**
     * Overrides OnInit component
     */
    ReceiptComponent.prototype.ngOnInit = function () {
        this.receiptFrm = this.fb.group({
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
            ])
        });
        this.loadReceiptList();
    };
    ReceiptComponent.prototype.loadReceiptList = function () {
        var _this = this;
        this.inLoading = true;
        this._journalvoucherService.get(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 4)
            .subscribe(function (receiptList) {
            _this.receiptList = receiptList;
            _this.inLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    ReceiptComponent.prototype.addReceipt = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add";
        this.modalBtnTitle = "Save";
        this.receiptFrm.reset();
        this.receiptFrm.controls['Name'].setValue('Receipt');
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
    ReceiptComponent.prototype.getJournalVoucher = function (Id) {
        this.inLoading = true;
        return this._journalvoucherService.get(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT + '?TransactionId=' + Id);
    };
    ReceiptComponent.prototype.editReceipt = function (Id) {
        var _this = this;
        debugger;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Receipt ";
        this.modalBtnTitle = "Update";
        this.getJournalVoucher(Id)
            .subscribe(function (receipt) {
            _this.inLoading = false;
            _this.receiptFrm.controls['Id'].setValue(receipt.Id);
            _this.receiptFrm.controls['Name'].setValue(receipt.Name);
            _this.receiptFrm.controls['AccountTransactionDocumentId'].setValue(receipt.AccountTransactionDocumentId);
            _this.receiptFrm.controls['Date'].setValue(receipt.Date);
            _this.receiptFrm.controls['SourceAccountTypeId'].setValue(receipt.SourceAccountTypeId);
            _this.receiptFrm.controls['Description'].setValue(receipt.Description);
            _this.formattedDate = receipt.AccountTransactionValues[0]['Date'];
            _this.receiptFrm.controls['Date'].setValue(_this.formattedDate);
            _this.receiptFrm.controls['AccountTransactionValues'] = _this.fb.array([]);
            var control = _this.receiptFrm.controls['AccountTransactionValues'];
            for (var i = 0; i < receipt.AccountTransactionValues.length; i++) {
                control.push(_this.fb.group(receipt.AccountTransactionValues[i]));
            }
            _this.modalRef = _this.modalService.show(_this.TemplateRef, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-lg'
            });
        }, function (error) { return _this.msg = error; });
    };
    ReceiptComponent.prototype.deleteReceipt = function (Id) {
        var _this = this;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Delete Receipt";
        this.modalBtnTitle = "Delete";
        this.getJournalVoucher(Id)
            .subscribe(function (receipt) {
            _this.inLoading = false;
            _this.receiptFrm.controls['Id'].setValue(receipt.Id);
            _this.receiptFrm.controls['Name'].setValue(receipt.Name);
            _this.receiptFrm.controls['AccountTransactionDocumentId'].setValue(receipt.AccountTransactionDocumentId);
            _this.receiptFrm.controls['Date'].setValue(receipt.Date);
            _this.receiptFrm.controls['SourceAccountTypeId'].setValue(receipt.SourceAccountTypeId);
            _this.receiptFrm.controls['Description'].setValue(receipt.Description);
            _this.formattedDate = receipt.Date;
            _this.receiptFrm.controls['Date'].setValue(_this.formattedDate);
            _this.receiptFrm.controls['AccountTransactionValues'] = _this.fb.array([]);
            var control = _this.receiptFrm.controls['AccountTransactionValues'];
            for (var i = 0; i < receipt.AccountTransactionValues.length; i++) {
                control.push(_this.fb.group(receipt.AccountTransactionValues[i]));
            }
            _this.modalRef = _this.modalService.show(_this.TemplateRef, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-lg'
            });
        }, function (error) { return _this.msg = error; });
    };
    ReceiptComponent.prototype.initAccountValue = function () {
        //initialize our vouchers
        return this.fb.group({
            AccountId: ['', forms_1.Validators.required],
            Debit: [''],
            Credit: ['', forms_1.Validators.required]
        });
    };
    ReceiptComponent.prototype.addAccountValues = function () {
        var control = this.receiptFrm.controls['AccountTransactionValues'];
        var addReceipt = this.initAccountValue();
        control.push(addReceipt);
    };
    //remove the rows
    ReceiptComponent.prototype.removeAccount = function (i, Id) {
        debugger;
        var control = this.receiptFrm.controls['AccountTransactionValues'];
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
    ReceiptComponent.prototype.sumDebit = function () {
        var controls = this.receiptFrm.controls.AccountTransactionValues.value;
        return controls.reduce(function (total, accounts) {
            //debugger;
            return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
        }, 0);
    };
    ReceiptComponent.prototype.sumCredit = function () {
        var controls = this.receiptFrm.controls.AccountTransactionValues.value;
        return controls.reduce(function (total, accounts) {
            //debugger;
            return (accounts.Credit) ? (total + Math.round(accounts.Credit)) : total;
        }, 0);
    };
    ReceiptComponent.prototype.validateAllFields = function (formGroup) {
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
    ReceiptComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    ReceiptComponent.prototype.onSubmit = function () {
        var _this = this;
        debugger;
        this.msg = "";
        this.formSubmitAttempt = true;
        var receipt = this.receiptFrm;
        if (receipt.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._journalvoucherService.post(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT, receipt.value).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadReceiptList();
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
                    var receiptObj = {
                        Id: this.receiptFrm.controls['Id'].value,
                        Date: this.receiptFrm.controls['Date'].value,
                        Name: this.receiptFrm.controls['Name'].value,
                        SourceAccountTypeId: this.receiptFrm.controls['SourceAccountTypeId'].value,
                        AccountTransactionDocumentId: this.receiptFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.receiptFrm.controls['Description'].value,
                        AccountTransactionValues: this.receiptFrm.controls['AccountTransactionValues'].value
                    };
                    this._journalvoucherService.put(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT, receipt.value.Id, receiptObj).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadReceiptList();
                        }
                        else {
                            _this.msg = "There is some issue in saving records, please contact to system administrator!";
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.delete:
                    debugger;
                    var receiptObject = {
                        Id: this.receiptFrm.controls['Id'].value,
                        Date: this.receiptFrm.controls['Date'].value,
                        Name: this.receiptFrm.controls['Name'].value,
                        SourceAccountTypeId: this.receiptFrm.controls['SourceAccountTypeId'].value,
                        AccountTransactionDocumentId: this.receiptFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.receiptFrm.controls['Description'].value,
                        AccountTransactionValues: this.receiptFrm.controls['AccountTransactionValues'].value
                    };
                    this._journalvoucherService.delete(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT, receiptObject).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully deleted.");
                            _this.loadReceiptList();
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
            this.validateAllFields(receipt);
        }
    };
    ReceiptComponent.prototype.confirm = function () {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    };
    ReceiptComponent.prototype.reset = function () {
        //debugger;
        var control = this.receiptFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.receiptFrm.controls['AccountTransactionDocumentId'].reset();
            this.receiptFrm.controls['Date'].reset();
            this.receiptFrm.controls['SourceAccountTypeId'].reset();
            this.receiptFrm.controls['AccountTransactionValues'].reset();
        }
    };
    ReceiptComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.receiptFrm.enable() : this.receiptFrm.disable();
    };
    /**
     *  Get the list of filtered journals by the form and to date
     */
    ReceiptComponent.prototype.filterReceiptsByDate = function () {
        var _this = this;
        this.inLoading = true;
        this._journalvoucherService.get(global_1.Global.BASE_JOURNALVOUCHER_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 4)
            .subscribe(function (receiptList) {
            _this.receiptList = receiptList;
            _this.inLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    __decorate([
        core_1.ViewChild('template')
    ], ReceiptComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], ReceiptComponent.prototype, "TemplateRef2", void 0);
    ReceiptComponent = __decorate([
        core_1.Component({
            templateUrl: './receipt.component.html',
            styleUrls: ['./receipt.component.css']
        })
    ], ReceiptComponent);
    return ReceiptComponent;
}());
exports.ReceiptComponent = ReceiptComponent;
