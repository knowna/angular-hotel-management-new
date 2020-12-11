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
var SalesComponent = /** @class */ (function () {
    function SalesComponent(fb, _purchaseService, _purchaseDetailsService, _accountTransValues, date, modalService) {
        var _this = this;
        this.fb = fb;
        this._purchaseService = _purchaseService;
        this._purchaseDetailsService = _purchaseDetailsService;
        this._accountTransValues = _accountTransValues;
        this.date = date;
        this.modalService = modalService;
        this.indLoading = false;
        this._purchaseService.getAccounts().subscribe(function (data) { _this.account = data; });
        this.fromDate = new Date(2018, 0, 1);
        this.toDate = new Date(2018, 11, 31);
        this.entityLists = [
            { id: 0, name: 'Dr' },
            { id: 1, name: 'Cr' }
        ];
    }
    SalesComponent.prototype.ngOnInit = function () {
        this.salesForm = this.fb.group({
            Id: [''],
            Name: [''],
            AccountTransactionDocumentId: [''],
            Date: [''],
            Description: ['', forms_1.Validators.required],
            Amount: [''],
            SaleOrderDetails: this.fb.array([
                this.initSaleOrderDetails(),
            ]),
            AccountTransactionValues: this.fb.array([
                this.initJournalDetail(),
            ]),
        });
        this.loadPurchaseList();
    };
    SalesComponent.prototype.loadPurchaseList = function () {
        var _this = this;
        debugger;
        this.indLoading = true;
        this._purchaseService.get(global_1.Global.BASE_SALES_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 3)
            .subscribe(function (purchase) { _this.purchase = purchase; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    SalesComponent.prototype.addPurchase = function () {
        debugger;
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Sales";
        this.modalBtnTitle = "Save";
        this.salesForm.reset();
        this.salesForm.controls['Name'].setValue('Sales');
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    SalesComponent.prototype.editPurchase = function (Id) {
        debugger;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit";
        this.modalBtnTitle = "Update";
        this.purchases = this.purchase.filter(function (x) { return x.Id == Id; })[0];
        this.salesForm.controls['Id'].setValue(this.purchases.Id);
        this.formattedDate = this.date.transform(this.purchases.AccountTransactionValues[0]['Date'], 'dd/MM/yyyy');
        this.salesForm.controls['Date'].setValue(this.formattedDate);
        this.salesForm.controls['Name'].setValue(this.purchases.Name);
        this.salesForm.controls['AccountTransactionDocumentId'].setValue(this.purchases.AccountTransactionDocumentId);
        this.salesForm.controls['Description'].setValue(this.purchases.Description);
        this.salesForm.controls['SaleOrderDetails'] = this.fb.array([]);
        var control = this.salesForm.controls['SaleOrderDetails'];
        for (var i = 0; i < this.purchases.SaleOrderDetails.length; i++) {
            control.push(this.fb.group(this.purchases.SaleOrderDetails[i]));
        }
        this.salesForm.controls['AccountTransactioValues'] = this.fb.array([]);
        var controlAc = this.salesForm.controls['AccountTransactionValues'];
        controlAc.controls = [];
        for (var i = 0; i < this.purchases.AccountTransactionValues.length; i++) {
            var valuesFromServer = this.purchases.AccountTransactionValues[i];
            var instance = this.fb.group(valuesFromServer);
            if (valuesFromServer['entityLists'] === "Dr") {
                instance.controls['Credit'].disable();
            }
            else if (valuesFromServer['entityLists'] === "Cr") {
                instance.controls['Debit'].disable();
            }
            controlAc.push(instance);
        }
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    SalesComponent.prototype.deletePurchase = function (Id) {
        debugger;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Delete Sales Items";
        this.modalBtnTitle = "Delete";
        this.purchases = this.purchase.filter(function (x) { return x.Id == Id; })[0];
        this.salesForm.controls['Id'].setValue(this.purchases.Id);
        this.formattedDate = this.date.transform(this.purchases.Date, 'dd/MM/yyyy');
        this.salesForm.controls['Date'].setValue(this.formattedDate);
        this.salesForm.controls['Name'].setValue(this.purchases.Name);
        this.salesForm.controls['AccountTransactionDocumentId'].setValue(this.purchases.AccountTransactionDocumentId);
        this.salesForm.controls['Description'].setValue(this.purchases.Description);
        this.salesForm.controls['SaleOrderDetails'] = this.fb.array([]);
        var control = this.salesForm.controls['SaleOrderDetails'];
        this.salesForm.controls['AccountTransactioValues'] = this.fb.array([]);
        var controlAc = this.salesForm.controls['AccountTransactionValues'];
        debugger;
        for (var i = 0; i < this.purchases.SaleOrderDetails.length; i++) {
            control.push(this.fb.group(this.purchases.SaleOrderDetails[i]));
        }
        debugger;
        for (var i = 0; i < this.purchases.AccountTransactionValues.length; i++) {
            var valuesFromServer = this.purchases.AccountTransactionValues[i];
            var instance = this.fb.group(valuesFromServer);
            if (valuesFromServer['entityLists'] === "Dr") {
                instance.controls['Credit'].disable();
            }
            else if (valuesFromServer['entityLists'] === "Cr") {
                instance.controls['Debit'].disable();
            }
            controlAc.push(instance);
        }
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    // Initialize the formb uilder arrays
    SalesComponent.prototype.initSaleOrderDetails = function () {
        return this.fb.group({
            Id: '',
            IsSelected: '',
            IsVoid: '',
            ItemId: '',
            OrderId: '',
            OrderNumber: '',
            Qty: '',
            Tags: '',
            UnitPrice: '',
            TotalAmount: ''
        });
    };
    SalesComponent.prototype.initJournalDetail = function () {
        return this.fb.group({
            entityLists: ['', forms_1.Validators.required],
            AccountId: ['', forms_1.Validators.required],
            Debit: [''],
            Credit: [''],
        });
    };
    // Push the values of purchasdetails
    SalesComponent.prototype.addPurchaseitems = function () {
        var control = this.salesForm.controls['SaleOrderDetails'];
        var addPurchaseValues = this.initSaleOrderDetails();
        control.push(addPurchaseValues);
    };
    // remove the rows generated
    SalesComponent.prototype.removePurchaseitems = function (i, PurchaseId) {
        var control = this.salesForm.controls['SaleOrderDetails'];
        if (i > 0) {
            this._purchaseDetailsService.delete(global_1.Global.BASE_PURCHASEDETAILS_ENDPOINT, PurchaseId).subscribe(function (data) {
                if (data == 1) {
                    control.removeAt(i);
                }
            });
        }
        else {
            alert("Form requires at least one row");
        }
    };
    SalesComponent.prototype.addJournalitems = function () {
        var control = this.salesForm.controls['AccountTransactionValues'];
        var addPurchaseValues = this.initJournalDetail();
        control.push(addPurchaseValues);
    };
    // Remove the rows
    SalesComponent.prototype.removeJournal = function (i, Id) {
        debugger;
        var control = this.salesForm.controls['AccountTransactionValues'];
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
    //Calulate total amount of all columns //
    SalesComponent.prototype.calculateAmount = function () {
        var controls = this.salesForm.controls['SaleOrderDetails'].value;
        return controls.reduce(function (total, accounts) {
            return (accounts.TotalAmount) ? (total + Math.round(accounts.TotalAmount)) : total;
        }, 0);
    };
    SalesComponent.prototype.sumDebit = function (journalDetailsFrm) {
        var controls = this.salesForm.controls.AccountTransactionValues.value;
        return controls.reduce(function (total, accounts) {
            return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
        }, 0);
    };
    //calculate the sum of credit columns//
    SalesComponent.prototype.sumCredit = function (journalDetailsFrm) {
        var controls = this.salesForm.controls.AccountTransactionValues.value;
        return controls.reduce(function (total, accounts) {
            return (accounts.Credit) ? (total + Math.round(accounts.Credit)) : total;
        }, 0);
    };
    SalesComponent.prototype.validateAllFields = function (formGroup) {
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
    //enable disable the debit and credit on change entitylists//
    SalesComponent.prototype.enableDisable = function (data) {
        debugger;
        if (data.entityLists.value == 'Dr') {
            data.Debit.enable();
            data.Credit.disable();
            data.Credit.reset();
        }
        else if (data.entityLists.value == 'Cr') {
            data.Credit.enable();
            data.Debit.disable();
            data.Debit.reset();
        }
        else {
            data.Debit.enable();
            data.Credit.enable();
        }
    };
    //Opens confirm window modal//
    SalesComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    SalesComponent.prototype.onSubmit = function () {
        var _this = this;
        debugger;
        this.msg = "";
        this.formSubmitAttempt = true;
        var sales = this.salesForm;
        var salesForm = JSON.parse(JSON.stringify(sales.value));
        salesForm.Date = this.date.transform(salesForm.Date, 'dd/MM/yyyy');
        if (sales.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._purchaseService.post(global_1.Global.BASE_SALES_ENDPOINT, salesForm).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadPurchaseList();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.update:
                    var purchaseObj = {
                        Id: this.salesForm.controls['Id'].value,
                        Date: this.date.transform(this.salesForm.controls['Date'].value, 'dd/MM/yyyy'),
                        Name: this.salesForm.controls['Name'].value,
                        AccountTransactionDocumentId: this.salesForm.controls['AccountTransactionDocumentId'].value,
                        Description: this.salesForm.controls['Description'].value,
                        SaleOrderDetails: this.salesForm.controls['SaleOrderDetails'].value,
                        AccountTransactionValues: this.salesForm.controls['AccountTransactionValues'].value
                    };
                    this._purchaseService.put(global_1.Global.BASE_SALES_ENDPOINT, sales.value.Id, purchaseObj).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadPurchaseList();
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
                    var purchaseObjc = {
                        Id: this.salesForm.controls['Id'].value,
                        Date: this.date.transform(this.salesForm.controls['Date'].value, 'dd/MM/yyyy'),
                        Name: this.salesForm.controls['Name'].value,
                        AccountTransactionDocumentId: this.salesForm.controls['AccountTransactionDocumentId'].value,
                        Description: this.salesForm.controls['Description'].value,
                        SaleOrderDetails: this.salesForm.controls['SaleOrderDetails'].value,
                        AccountTransactionValues: this.salesForm.controls['AccountTransactionValues'].value
                    };
                    this._purchaseService.delete(global_1.Global.BASE_SALES_ENDPOINT, purchaseObjc).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully deleted.");
                            _this.loadPurchaseList();
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
            this.validateAllFields(sales);
        }
    };
    SalesComponent.prototype.confirm = function () {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    };
    SalesComponent.prototype.reset = function () {
        var control = this.salesForm.controls["Id"].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.salesForm.controls['AccountTransactionDocumentId'].reset();
            this.salesForm.controls['Date'].reset();
            this.salesForm.controls['Description'].reset();
            this.salesForm.controls['SaleOrderDetails'].reset();
            this.salesForm.controls['AccountTransactionValues'].reset();
        }
    };
    SalesComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.salesForm.enable() : this.salesForm.disable();
    };
    /**
     *  Get the list of filtered Purchases by the form and to date
     */
    SalesComponent.prototype.filterPurchasesByDate = function () {
        var _this = this;
        this.indLoading = true;
        this._purchaseService.get(global_1.Global.BASE_SALES_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 3)
            .subscribe(function (purchase) {
            _this.purchase = purchase;
            _this.indLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    __decorate([
        core_1.ViewChild("template")
    ], SalesComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], SalesComponent.prototype, "TemplateRef2", void 0);
    SalesComponent = __decorate([
        core_1.Component({
            templateUrl: './sales.component.html',
            styleUrls: ['./sales.component.css']
        })
    ], SalesComponent);
    return SalesComponent;
}());
exports.SalesComponent = SalesComponent;
