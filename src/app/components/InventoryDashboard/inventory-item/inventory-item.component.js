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
var InventoryItemComponent = /** @class */ (function () {
    function InventoryItemComponent(fb, _inventoryService, modalService) {
        var _this = this;
        this.fb = fb;
        this._inventoryService = _inventoryService;
        this.modalService = modalService;
        this.indLoading = false;
        this.receiptProducts = [];
        this._inventoryService.getCategories().subscribe(function (data) { _this.category = data; });
    }
    InventoryItemComponent.prototype.ngOnInit = function () {
        this.InventFrm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required],
            BaseUnit: [''],
            TransactionUnit: ['', forms_1.Validators.required],
            TransactionUnitMultiplier: ['', forms_1.Validators.required],
            Category: ['', forms_1.Validators.required]
        });
        this.LoadInventoryItems();
    };
    InventoryItemComponent.prototype.LoadInventoryItems = function () {
        var _this = this;
        this.indLoading = true;
        this._inventoryService.get(global_1.Global.BASE_INVENTORY_ENDPOINT)
            .subscribe(function (InventoryItems) { _this.InventoryItems = InventoryItems; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    InventoryItemComponent.prototype.addInventory = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Item";
        this.modalBtnTitle = "Save";
        this.InventFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    InventoryItemComponent.prototype.editInventory = function (Id) {
        debugger;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Item";
        this.modalBtnTitle = "Update";
        this.InventoryItem = this.InventoryItems.filter(function (x) { return x.Id == Id; })[0];
        this.InventFrm.setValue(this.InventoryItem);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    InventoryItemComponent.prototype.deleteInventory = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.InventoryItem = this.InventoryItems.filter(function (x) { return x.Id == id; })[0];
        this.InventFrm.setValue(this.InventoryItem);
        // this.modal.open();
    };
    InventoryItemComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        switch (this.dbops) {
            case enum_1.DBOperation.create:
                this._inventoryService.post(global_1.Global.BASE_INVENTORY_ENDPOINT, formData._value).subscribe(function (data) {
                    if (data == 1) {
                        alert("Data successfully added.");
                        _this.modalRef.hide();
                        _this.LoadInventoryItems();
                    }
                    else {
                        alert("There is some issue in saving records, please contact to system administrator!");
                    }
                }, function (error) {
                    _this.msg = error;
                });
                break;
            case enum_1.DBOperation.update:
                debugger;
                this._inventoryService.put(global_1.Global.BASE_INVENTORY_ENDPOINT, formData._value.Id, formData._value).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully updated.";
                        _this.LoadInventoryItems();
                    }
                    else {
                        _this.msg = "There is some issue in saving records, please contact to system administrator!";
                    }
                    _this.modalRef.hide();
                }, function (error) {
                    _this.msg = error;
                });
                break;
            case enum_1.DBOperation.delete:
                this._inventoryService.delete(global_1.Global.BASE_INVENTORY_ENDPOINT, formData._value.Id).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully deleted.";
                        _this.LoadInventoryItems();
                    }
                    else {
                        _this.msg = "There is some issue in saving records, please contact to system administrator!";
                    }
                    _this.modalRef.hide();
                }, function (error) {
                    _this.msg = error;
                });
                break;
        }
    };
    InventoryItemComponent.prototype.reset = function () {
        this.InventFrm.reset();
    };
    InventoryItemComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.InventFrm.enable() : this.InventFrm.disable();
    };
    __decorate([
        core_1.ViewChild("template")
    ], InventoryItemComponent.prototype, "TemplateRef", void 0);
    InventoryItemComponent = __decorate([
        core_1.Component({
            templateUrl: './inventory-item.component.html'
        })
    ], InventoryItemComponent);
    return InventoryItemComponent;
}());
exports.InventoryItemComponent = InventoryItemComponent;
