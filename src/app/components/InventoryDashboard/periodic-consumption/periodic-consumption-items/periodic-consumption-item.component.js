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
var PeriodicConsumptionItemComponent = /** @class */ (function () {
    function PeriodicConsumptionItemComponent(fb, _pcitemService, modalService) {
        //this.accTypeService.getaccounttypes().subscribe(data => { this.accountTypes = data });
        //this.accTypeService.get().subscribe(res => this.accountType = res)
        this.fb = fb;
        this._pcitemService = _pcitemService;
        this.modalService = modalService;
        this.indLoading = false;
    }
    PeriodicConsumptionItemComponent.prototype.ngOnInit = function () {
        this.pcItemFrm = this.fb.group({
            Id: [''],
            WarehouseConsumptionId: [''],
            PeriodicConsumptionId: [''],
            InventoryItemId: [''],
            InventoryItemName: [''],
            UnitName: [''],
            InStock: [''],
            Added: ['',],
            Removed: [''],
            Consumption: [''],
            PhysicalInventory: [''],
            Cost: [''],
        });
        this.LoadAccTypes();
    };
    PeriodicConsumptionItemComponent.prototype.LoadAccTypes = function () {
        var _this = this;
        debugger;
        this.indLoading = true;
        this._pcitemService.get(global_1.Global.BASE_ACCOUNTTYPE_ENDPOINT)
            .subscribe(function (pcitems) { _this.pcItems = pcitems; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    PeriodicConsumptionItemComponent.prototype.addPeriodicConsumedItem = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New AccountType";
        this.modalBtnTitle = "Add";
        this.pcItemFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    PeriodicConsumptionItemComponent.prototype.editPeriodicConsumedItem = function (Id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Account Type";
        this.modalBtnTitle = "Update";
        this.pcItem = this.pcItems.filter(function (x) { return x.Id == Id; })[0];
        this.pcItemFrm.setValue(this.pcItem);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    PeriodicConsumptionItemComponent.prototype.deletePeriodicConsumedItem = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.pcItem = this.pcItems.filter(function (x) { return x.Id == id; })[0];
        this.pcItemFrm.setValue(this.pcItem);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    PeriodicConsumptionItemComponent.prototype.validateAllFields = function (formGroup) {
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
    PeriodicConsumptionItemComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    //Submit the Form
    PeriodicConsumptionItemComponent.prototype.onSubmit = function () {
        var _this = this;
        debugger;
        this.msg = "";
        var pcItem = this.pcItemFrm;
        this.formSubmitAttempt = true;
        if (pcItem.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._pcitemService.post(global_1.Global.BASE_ACCOUNTTYPE_ENDPOINT, pcItem.value).subscribe(function (data) {
                        if (data == 1) {
                            debugger;
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
                    this._pcitemService.put(global_1.Global.BASE_ACCOUNTTYPE_ENDPOINT, pcItem.value.Id, pcItem.value).subscribe(function (data) {
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
                    this._pcitemService.delete(global_1.Global.BASE_ACCOUNTTYPE_ENDPOINT, pcItem.value.Id).subscribe(function (data) {
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
            this.validateAllFields(pcItem);
        }
    };
    PeriodicConsumptionItemComponent.prototype.confirm = function () {
        this.modalRef2.hide();
    };
    PeriodicConsumptionItemComponent.prototype.reset = function () {
        //debugger;
        var control = this.pcItemFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.pcItemFrm.reset();
        }
    };
    PeriodicConsumptionItemComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.pcItemFrm.enable() : this.pcItemFrm.disable();
    };
    __decorate([
        core_1.ViewChild('template')
    ], PeriodicConsumptionItemComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], PeriodicConsumptionItemComponent.prototype, "TemplateRef2", void 0);
    PeriodicConsumptionItemComponent = __decorate([
        core_1.Component({
            templateUrl: './periodic-consumption-item.component.html'
        })
    ], PeriodicConsumptionItemComponent);
    return PeriodicConsumptionItemComponent;
}());
exports.PeriodicConsumptionItemComponent = PeriodicConsumptionItemComponent;
