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
var AccountTypeComponent = /** @class */ (function () {
    function AccountTypeComponent(fb, accTypeService, modalService) {
        var _this = this;
        this.fb = fb;
        this.accTypeService = accTypeService;
        this.modalService = modalService;
        this.indLoading = false;
        this.accTypeService.getaccounttypes().subscribe(function (data) { _this.accountTypes = data; });
        //this.accTypeService.get().subscribe(res => this.accountType = res)
    }
    AccountTypeComponent.prototype.ngOnInit = function () {
        this.accTypeFrm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required],
            DefaultFilterType: [''],
            WorkingRule: [''],
            SortOrder: [''],
            UserString: [''],
            Tags: [''],
            UnderGroupLedger: ['', forms_1.Validators.required],
            NatureofGroup: ['', forms_1.Validators.required],
            GroupSubLedger: false,
            DebitCreditBalanceReporting: false,
            UsedforCalculation: false,
            PurchaseInvoiceAllocation: false,
            AFFECTSGROSSPROFIT: false,
            ISBILLWISEON: false,
            ISCOSTCENTRESON: false,
            ISADDABLE: false,
            ISREVENUE: false,
            ISDEEMEDPOSITIVE: false,
            TRACKNEGATIVEBALANCES: false,
            ISCONDENSED: false,
            AFFECTSSTOCK: false,
            SORTPOSITION: false
        });
        this.LoadAccTypes();
    };
    AccountTypeComponent.prototype.LoadAccTypes = function () {
        var _this = this;
        
        this.indLoading = true;
        this.accTypeService.get(global_1.Global.BASE_ACCOUNTTYPE_ENDPOINT)
            .subscribe(function (accounttypes) { _this.accountTypes = accounttypes; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    AccountTypeComponent.prototype.addAccType = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Group";
        this.modalBtnTitle = "Save";
        this.accTypeFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    AccountTypeComponent.prototype.editAccType = function (Id) {
        
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Group";
        this.modalBtnTitle = "Save";
        this.accountType = this.accountTypes.filter(function (x) { return x.Id == Id; })[0];
        this.accTypeFrm.setValue(this.accountType);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    AccountTypeComponent.prototype.deleteAccType = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete Group?";
        this.modalBtnTitle = "Delete";
        this.accountType = this.accountTypes.filter(function (x) { return x.Id == id; })[0];
        this.accTypeFrm.setValue(this.accountType);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    AccountTypeComponent.prototype.validateAllFields = function (formGroup) {
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
    AccountTypeComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    //Submit the Form
    AccountTypeComponent.prototype.onSubmit = function () {
        var _this = this;
        
        this.msg = "";
        var accountType = this.accTypeFrm;
        this.formSubmitAttempt = true;
        if (accountType.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this.accTypeService.post(global_1.Global.BASE_ACCOUNTTYPE_ENDPOINT, accountType.value).subscribe(function (data) {
                        if (data == 1) {
                            
                            _this.openModal2(_this.TemplateRef2);
                            _this.LoadAccTypes();
                        }
                        else {
                            // this.modal.backdrop;
                            _this.msg = "There is some issue in saving records, please contact to system administrator!";
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.update:
                    this.accTypeService.put(global_1.Global.BASE_ACCOUNTTYPE_ENDPOINT, accountType.value.Id, accountType.value).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.LoadAccTypes();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.delete:
                    this.accTypeService.delete(global_1.Global.BASE_ACCOUNTTYPE_ENDPOINT, accountType.value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data deleted sucessfully");
                            _this.LoadAccTypes();
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
    };
    AccountTypeComponent.prototype.confirm = function () {
        this.modalRef2.hide();
    };
    AccountTypeComponent.prototype.reset = function () {
        //
        var control = this.accTypeFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.accTypeFrm.reset();
        }
    };
    AccountTypeComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.accTypeFrm.enable() : this.accTypeFrm.disable();
    };
    __decorate([
        core_1.ViewChild('template')
    ], AccountTypeComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], AccountTypeComponent.prototype, "TemplateRef2", void 0);
    AccountTypeComponent = __decorate([
        core_1.Component({
            templateUrl: './account-type.component.html'
        })
    ], AccountTypeComponent);
    return AccountTypeComponent;
}());
exports.AccountTypeComponent = AccountTypeComponent;
