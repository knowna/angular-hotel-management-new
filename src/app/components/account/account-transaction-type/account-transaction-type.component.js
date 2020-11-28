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
var AccountTransactionTypeComponent = /** @class */ (function () {
    function AccountTransactionTypeComponent(fb, acctransTypeService, modalService) {
        var _this = this;
        this.fb = fb;
        this.acctransTypeService = acctransTypeService;
        this.modalService = modalService;
        this.indLoading = false;
        this.acctransTypeService.getAccountTypes().subscribe(function (data) { _this.acctype = data; });
    }
    AccountTransactionTypeComponent.prototype.ngOnInit = function () {
        this.acctransTypeFrm = this.fb.group({
            Id: [''],
            SortOrder: [''],
            SourceAccountTypeId: ['', forms_1.Validators.required],
            TargetAccountTypeId: ['', forms_1.Validators.required],
            DefaultSourceAccountId: [''],
            DefaultTargetAccountId: [''],
            ForeignCurrencyId: [''],
            UserString: [''],
            Name: [''],
        });
        this.LoadAcctransTypes();
    };
    AccountTransactionTypeComponent.prototype.LoadAcctransTypes = function () {
        var _this = this;
        this.indLoading = true;
        this.acctransTypeService.get(global_1.Global.BASE_ACCOUNTTRANSTYPE_ENDPOINT)
            .subscribe(function (accounttransTypes) { _this.accounttransTypes = accounttransTypes; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    AccountTransactionTypeComponent.prototype.addAcctransType = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Transaction Type";
        this.modalBtnTitle = "Save";
        this.acctransTypeFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    AccountTransactionTypeComponent.prototype.editAcctransType = function (Id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Transaction Type";
        this.modalBtnTitle = "Save";
        this.accounttransType = this.accounttransTypes.filter(function (x) { return x.Id == Id; })[0];
        this.acctransTypeFrm.setValue(this.accounttransType);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    AccountTransactionTypeComponent.prototype.deleteAcctransType = function (id) {
        debugger;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete Transaction Type?";
        this.modalBtnTitle = "Delete";
        this.accounttransType = this.accounttransTypes.filter(function (x) { return x.Id == id; })[0];
        this.acctransTypeFrm.setValue(this.accounttransType);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    AccountTransactionTypeComponent.prototype.validateAllFields = function (formGroup) {
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
    //displays the confirm popup-window
    AccountTransactionTypeComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    //Submit the Form
    AccountTransactionTypeComponent.prototype.onSubmit = function () {
        var _this = this;
        debugger;
        this.msg = "";
        var accountType = this.acctransTypeFrm;
        this.formSubmitAttempt = true;
        if (accountType.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this.acctransTypeService.post(global_1.Global.BASE_ACCOUNTTRANSTYPE_ENDPOINT, accountType.value).subscribe(function (data) {
                        if (data == 1) {
                            debugger;
                            _this.openModal2(_this.TemplateRef2);
                            _this.LoadAcctransTypes();
                        }
                        else {
                            // this.modal.backdrop;
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.update:
                    this.acctransTypeService.put(global_1.Global.BASE_ACCOUNTTRANSTYPE_ENDPOINT, accountType.value.Id, accountType.value).subscribe(function (data) {
                        if (data == 1) {
                            debugger;
                            _this.openModal2(_this.TemplateRef2);
                            _this.LoadAcctransTypes();
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
                    this.acctransTypeService.delete(global_1.Global.BASE_ACCOUNTTRANSTYPE_ENDPOINT, accountType.value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data deleted sucessfully");
                            _this.LoadAcctransTypes();
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
            this.validateAllFields(accountType);
        }
        //this.acctransTypeService.delete(Global.BASE_ACCOUNTTRANSTYPE_ENDPOINT, accountType.value.Id).subscribe(
        //    data => {
        //        if (data == 1) //Success
        //        {
        //            this.msg = "Data successfully deleted.";
        //            this.LoadAcctransTypes();
        //        }
        //        else {
        //            this.msg = "There is some issue in saving records, please contact to system administrator!"
        //        }
        //        this.modalRef.hide();
        //    },
        //);
    };
    AccountTransactionTypeComponent.prototype.confirm = function () {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    };
    AccountTransactionTypeComponent.prototype.reset = function () {
        //debugger;
        var control = this.acctransTypeFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.acctransTypeFrm.reset();
            this.formSubmitAttempt = false;
        }
    };
    AccountTransactionTypeComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.acctransTypeFrm.enable() : this.acctransTypeFrm.disable();
    };
    __decorate([
        core_1.ViewChild('template')
    ], AccountTransactionTypeComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], AccountTransactionTypeComponent.prototype, "TemplateRef2", void 0);
    AccountTransactionTypeComponent = __decorate([
        core_1.Component({
            templateUrl: './account-transaction-type.component.html'
        })
    ], AccountTransactionTypeComponent);
    return AccountTransactionTypeComponent;
}());
exports.AccountTransactionTypeComponent = AccountTransactionTypeComponent;
