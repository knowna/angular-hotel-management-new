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
var MasterLedgerComponent = /** @class */ (function () {
    function MasterLedgerComponent(fb, _masterLedgerService, modalService) {
        this.fb = fb;
        this._masterLedgerService = _masterLedgerService;
        this.modalService = modalService;
        this.indLoading = false;
    }
    MasterLedgerComponent.prototype.ngOnInit = function () {
        this.masterLedgerFrm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required],
            UnderGroupMaster: ['', forms_1.Validators.required],
            InventoryValue: false,
            MaintainBilByBill: false,
            TaxClassificationName: [''],
            TaxType: ['', forms_1.Validators.required],
            TaxRate: [''],
            TraderLedNatureOfPurchase: ['', forms_1.Validators.required],
            TDSDeducteeType: ['', forms_1.Validators.required],
            TDSRateName: ['', forms_1.Validators.required],
            Address: ['', forms_1.Validators.required],
            District: ['', forms_1.Validators.required],
            City: ['', forms_1.Validators.required],
            Street: ['', forms_1.Validators.required],
            PanNo: ['', forms_1.Validators.required],
            Telephone: ['', forms_1.Validators.required],
            Email: ['', forms_1.Validators.required],
            Currency: ['', forms_1.Validators.required],
            IsBillWiseOn: [''],
            ISCostCentresOn: [''],
            IsInterestOn: [''],
            AllowInMobile: [''],
            IsCondensed: [''],
            AffectsStock: [''],
            ForPayRoll: [''],
            InterestOnBillWise: [''],
            OverRideInterest: [''],
            OverRideADVInterest: [''],
            IgnoreTDSExempt: [''],
            UseForVat: [''],
            IsTCSApplicable: [''],
            IsTDSApplicable: [''],
            IsFBTApplicable: [''],
            IsGSTApplicable: [''],
            ShowInPaySlip: [''],
            UseForGratuity: [''],
            ForServiceTax: [''],
            IsInputCredit: [''],
            IsExempte: [''],
            IsAbatementApplicable: [''],
            TDSDeducteeIsSpecialRate: [''],
            Audited: [],
            Amount: ['', forms_1.Validators.required]
        });
        this.LoadMasters();
    };
    MasterLedgerComponent.prototype.LoadMasters = function () {
        var _this = this;
        this.indLoading = true;
        this._masterLedgerService.get(global_1.Global.BASE_MASTERLEDGER_ENDPOINT)
            .subscribe(function (masterLedgers) { _this.masterLedgers = masterLedgers; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    MasterLedgerComponent.prototype.addMasterLedger = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Master Ledger";
        this.modalBtnTitle = "Add";
        this.masterLedgerFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    MasterLedgerComponent.prototype.editMasterLedger = function (Id) {
        //
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Group Ledger";
        this.modalBtnTitle = "Update";
        this.masterLedger = this.masterLedgers.filter(function (x) { return x.Id == Id; })[0];
        this.masterLedgerFrm.setValue(this.masterLedger);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    MasterLedgerComponent.prototype.deleteMasterLedger = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.masterLedger = this.masterLedgers.filter(function (x) { return x.Id == id; })[0];
        this.masterLedgerFrm.setValue(this.masterLedger);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    };
    MasterLedgerComponent.prototype.validateAllFields = function (formGroup) {
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
    MasterLedgerComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    MasterLedgerComponent.prototype.onSubmit = function () {
        var _this = this;
        //this.isChecked = Number(data['status']) === 0 ? false : true;
        this.msg = "";
        var master = this.masterLedgerFrm;
        this.formSubmitAttempt = true;
        if (master.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._masterLedgerService.post(global_1.Global.BASE_MASTERLEDGER_ENDPOINT, master.value).subscribe(function (data) {
                        if (data == 1) {
                            //alert("Data successfully added.");
                            _this.openModal2(_this.TemplateRef2);
                            _this.LoadMasters();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    }, function (error) {
                        _this.msg = error;
                    });
            }
        }
        else {
            this.validateAllFields(master);
        }
    };
    MasterLedgerComponent.prototype.confirm = function () {
        this.modalRef2.hide();
    };
    MasterLedgerComponent.prototype.reset = function () {
        //
        var control = this.masterLedgerFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.masterLedgerFrm.reset();
        }
    };
    MasterLedgerComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.masterLedgerFrm.enable() : this.masterLedgerFrm.disable();
    };
    __decorate([
        core_1.ViewChild('template')
    ], MasterLedgerComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], MasterLedgerComponent.prototype, "TemplateRef2", void 0);
    MasterLedgerComponent = __decorate([
        core_1.Component({
            templateUrl: './master-Ledger.component.html'
        })
    ], MasterLedgerComponent);
    return MasterLedgerComponent;
}());
exports.MasterLedgerComponent = MasterLedgerComponent;
