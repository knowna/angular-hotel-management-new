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
var PurchaseComponent = /** @class */ (function () {
    function PurchaseComponent(fb, _purchaseService, _purchaseDetailsService, _accountTransValues, date, modalService) {
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
    // Overide init component life-cycle hook    
    PurchaseComponent.prototype.ngOnInit = function () {
        this.purchaseFrm = this.fb.group({
            Id: [''],
            Name: [''],
            AccountTransactionDocumentId: [''],
            Date: [''],
            Description: ['', forms_1.Validators.required],
            Amount: [''],
            PurchaseDetails: this.fb.array([
                this.initPurchase(),
            ]),
            AccountTransactionValues: this.fb.array([
                this.initJournalDetail(),
            ]),
        });
        // Load purchases list
        this.loadPurchaseList();
    };
    /**
     * Load list of purchases form the server
     */
    PurchaseComponent.prototype.loadPurchaseList = function () {
        var _this = this;
        this.indLoading = true;
        // this.date.transform(this.fromDate, 'dd/MM/yyyy hh:MM:ss a')
        this._purchaseService.get(global_1.Global.BASE_PURCHASE_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 9)
            .subscribe(function (purchase) { _this.purchase = purchase; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    /**
     * Open Add New Purchase Form Modal
     */
    PurchaseComponent.prototype.addPurchase = function () {
        debugger;
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Purchase";
        this.modalBtnTitle = "Save";
        this.purchaseFrm.reset();
        this.purchaseFrm.controls['Name'].setValue('Purchase');
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
    PurchaseComponent.prototype.getPurchaseDetails = function (Id) {
        this.indLoading = true;
        return this._purchaseService.get(global_1.Global.BASE_PURCHASE_ENDPOINT + '?TransactionId=' + Id);
    };
    /**
     * Opens Edit Existing Journal Voucher Form Modal
     * @param Id
     */
    PurchaseComponent.prototype.editPurchase = function (Id) {
        var _this = this;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit";
        this.modalBtnTitle = "Update";
        this.getPurchaseDetails(Id)
            .subscribe(function (purchase) {
            _this.indLoading = false;
            _this.purchaseFrm.controls['Id'].setValue(purchase.Id);
            _this.formattedDate = purchase.AccountTransactionValues[0]['Date'];
            _this.purchaseFrm.controls['Date'].setValue(_this.formattedDate);
            _this.purchaseFrm.controls['Name'].setValue(purchase.Name);
            _this.purchaseFrm.controls['AccountTransactionDocumentId'].setValue(purchase.AccountTransactionDocumentId);
            _this.purchaseFrm.controls['Description'].setValue(purchase.Description);
            _this.purchaseFrm.controls['PurchaseDetails'] = _this.fb.array([]);
            var control = _this.purchaseFrm.controls['PurchaseDetails'];
            for (var i = 0; i < purchase.PurchaseDetails.length; i++) {
                control.push(_this.fb.group(purchase.PurchaseDetails[i]));
            }
            _this.purchaseFrm.controls['AccountTransactioValues'] = _this.fb.array([]);
            var controlAc = _this.purchaseFrm.controls['AccountTransactionValues'];
            controlAc.controls = [];
            for (var i = 0; i < purchase.AccountTransactionValues.length; i++) {
                var valuesFromServer = purchase.AccountTransactionValues[i];
                var instance = _this.fb.group(valuesFromServer);
                if (valuesFromServer['entityLists'] === "Dr") {
                    instance.controls['Credit'].disable();
                }
                else if (valuesFromServer['entityLists'] === "Cr") {
                    instance.controls['Debit'].disable();
                }
                controlAc.push(instance);
            }
            _this.modalRef = _this.modalService.show(_this.TemplateRef, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-lg'
            });
        });
    };
    /**
     * Delete Existing Purchase
     * @param id
     */
    PurchaseComponent.prototype.deletePurchase = function (Id) {
        var _this = this;
        debugger;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Delete Purchase Items";
        this.modalBtnTitle = "Delete";
        this.getPurchaseDetails(Id)
            .subscribe(function (purchase) {
            _this.indLoading = false;
            _this.purchaseFrm.controls['Id'].setValue(purchase.Id);
            _this.formattedDate = purchase.AccountTransactionValues[0]['Date'];
            _this.purchaseFrm.controls['Date'].setValue(_this.formattedDate);
            _this.purchaseFrm.controls['Name'].setValue(purchase.Name);
            _this.purchaseFrm.controls['AccountTransactionDocumentId'].setValue(purchase.AccountTransactionDocumentId);
            _this.purchaseFrm.controls['Description'].setValue(purchase.Description);
            _this.purchaseFrm.controls['PurchaseDetails'] = _this.fb.array([]);
            var control = _this.purchaseFrm.controls['PurchaseDetails'];
            for (var i = 0; i < purchase.PurchaseDetails.length; i++) {
                control.push(_this.fb.group(purchase.PurchaseDetails[i]));
            }
            _this.purchaseFrm.controls['AccountTransactioValues'] = _this.fb.array([]);
            var controlAc = _this.purchaseFrm.controls['AccountTransactionValues'];
            controlAc.controls = [];
            for (var i = 0; i < purchase.AccountTransactionValues.length; i++) {
                var valuesFromServer = purchase.AccountTransactionValues[i];
                var instance = _this.fb.group(valuesFromServer);
                if (valuesFromServer['entityLists'] === "Dr") {
                    instance.controls['Credit'].disable();
                }
                else if (valuesFromServer['entityLists'] === "Cr") {
                    instance.controls['Debit'].disable();
                }
                controlAc.push(instance);
            }
            _this.modalRef = _this.modalService.show(_this.TemplateRef, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-lg'
            });
        });
    };
    // Initialize the formbuilder arrays//
    PurchaseComponent.prototype.initPurchase = function () {
        return this.fb.group({
            InventoryItemId: [''],
            Quantity: [''],
            PurchaseRate: [''],
            PurchaseAmount: ['']
        });
    };
    // Initialize the journal details//
    PurchaseComponent.prototype.initJournalDetail = function () {
        return this.fb.group({
            entityLists: ['', forms_1.Validators.required],
            AccountId: ['', forms_1.Validators.required],
            Debit: [''],
            Credit: [''],
        });
    };
    //Push the values of purchasdetails //
    PurchaseComponent.prototype.addPurchaseitems = function () {
        var control = this.purchaseFrm.controls['PurchaseDetails'];
        var addPurchaseValues = this.initPurchase();
        control.push(addPurchaseValues);
    };
    //remove the rows generated//
    PurchaseComponent.prototype.removePurchaseitems = function (i, PurchaseId) {
        var control = this.purchaseFrm.controls['PurchaseDetails'];
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
    // Push Journal Values in row    
    PurchaseComponent.prototype.addJournalitems = function () {
        var control = this.purchaseFrm.controls['AccountTransactionValues'];
        var addPurchaseValues = this.initJournalDetail();
        control.push(addPurchaseValues);
    };
    //remove the rows//
    PurchaseComponent.prototype.removeJournal = function (i, Id) {
        debugger;
        var control = this.purchaseFrm.controls['AccountTransactionValues'];
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
    PurchaseComponent.prototype.calculateAmount = function () {
        var controls = this.purchaseFrm.controls['PurchaseDetails'].value;
        return controls.reduce(function (total, accounts) {
            return (accounts.PurchaseAmount) ? (total + Math.round(accounts.PurchaseAmount)) : total;
        }, 0);
    };
    //calulate the sum of debit columns//
    PurchaseComponent.prototype.sumDebit = function (journalDetailsFrm) {
        var controls = this.purchaseFrm.controls.AccountTransactionValues.value;
        return controls.reduce(function (total, accounts) {
            return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
        }, 0);
    };
    //calculate the sum of credit columns//
    PurchaseComponent.prototype.sumCredit = function (journalDetailsFrm) {
        var controls = this.purchaseFrm.controls.AccountTransactionValues.value;
        return controls.reduce(function (total, accounts) {
            return (accounts.Credit) ? (total + Math.round(accounts.Credit)) : total;
        }, 0);
    };
    /**
     * Validate fields
     * @param formGroup
     */
    PurchaseComponent.prototype.validateAllFields = function (formGroup) {
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
    PurchaseComponent.prototype.enableDisable = function (data) {
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
    PurchaseComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    /**
     * Performs the form submit action for CRUD Operations
     * @param formData
     */
    PurchaseComponent.prototype.onSubmit = function () {
        var _this = this;
        debugger;
        this.msg = "";
        this.formSubmitAttempt = true;
        var purchase = this.purchaseFrm;
        if (purchase.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._purchaseService.post(global_1.Global.BASE_PURCHASE_ENDPOINT, purchase.value).subscribe(function (data) {
                        debugger;
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
                        Id: this.purchaseFrm.controls['Id'].value,
                        Date: this.purchaseFrm.controls['Date'].value,
                        Name: this.purchaseFrm.controls['Name'].value,
                        AccountTransactionDocumentId: this.purchaseFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.purchaseFrm.controls['Description'].value,
                        PurchaseDetails: this.purchaseFrm.controls['PurchaseDetails'].value,
                        AccountTransactionValues: this.purchaseFrm.controls['AccountTransactionValues'].value
                    };
                    this._purchaseService.put(global_1.Global.BASE_PURCHASE_ENDPOINT, purchase.value.Id, purchaseObj).subscribe(function (data) {
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
                        Id: this.purchaseFrm.controls['Id'].value,
                        Date: this.purchaseFrm.controls['Date'].value,
                        Name: this.purchaseFrm.controls['Name'].value,
                        AccountTransactionDocumentId: this.purchaseFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.purchaseFrm.controls['Description'].value,
                        PurchaseDetails: this.purchaseFrm.controls['PurchaseDetails'].value,
                        AccountTransactionValues: this.purchaseFrm.controls['AccountTransactionValues'].value
                    };
                    this._purchaseService.delete(global_1.Global.BASE_PURCHASE_ENDPOINT, purchaseObjc).subscribe(function (data) {
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
            this.validateAllFields(purchase);
        }
    };
    /**
     * Hides the confirm modal
     */
    PurchaseComponent.prototype.confirm = function () {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    };
    /**
     * Resets the journal form
     */
    PurchaseComponent.prototype.reset = function () {
        var control = this.purchaseFrm.controls["Id"].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.purchaseFrm.controls['AccountTransactionDocumentId'].reset();
            this.purchaseFrm.controls['Date'].reset();
            this.purchaseFrm.controls['Description'].reset();
            this.purchaseFrm.controls['PurchaseDetails'].reset();
            this.purchaseFrm.controls['AccountTransactionValues'].reset();
        }
    };
    /**
     * Sets control's state
     * @param isEnable
     */
    PurchaseComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.purchaseFrm.enable() : this.purchaseFrm.disable();
    };
    /**
     *  Get the list of filtered Purchases by the form and to date
     */
    PurchaseComponent.prototype.filterPurchasesByDate = function () {
        var _this = this;
        this.indLoading = true;
        this._purchaseService.get(global_1.Global.BASE_PURCHASE_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 9)
            .subscribe(function (purchase) {
            _this.purchase = purchase;
            _this.indLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    __decorate([
        core_1.ViewChild("template")
    ], PurchaseComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], PurchaseComponent.prototype, "TemplateRef2", void 0);
    PurchaseComponent = __decorate([
        core_1.Component({
            templateUrl: './purchase.component.html',
            styleUrls: ['./purchase.component.css']
        })
    ], PurchaseComponent);
    return PurchaseComponent;
}());
exports.PurchaseComponent = PurchaseComponent;
