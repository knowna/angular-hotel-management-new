"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var InventoryReceiptDetailsComponent = /** @class */ (function () {
    function InventoryReceiptDetailsComponent(_inventoryReceiptService) {
        var _this = this;
        this._inventoryReceiptService = _inventoryReceiptService;
        this._inventoryReceiptService.getInventoryItems().subscribe(function (data) { _this.inventoryItem = data; });
    }
    // calculate amount
    InventoryReceiptDetailsComponent.prototype.calculateAmount = function (InventoryReceiptDetails) {
         
        return InventoryReceiptDetails.TotalAmount.setValue(InventoryReceiptDetails.Quantity.value * InventoryReceiptDetails.Rate.value);
    };
    __decorate([
        core_1.Input('group')
    ], InventoryReceiptDetailsComponent.prototype, "InventoryReceiptDetails", void 0);
    InventoryReceiptDetailsComponent = __decorate([
        core_1.Component({
            //moduleId: module.id,
            selector: 'my-inventoryDetail-list',
            templateUrl: './inventory-receiptdetails.component.html'
        })
    ], InventoryReceiptDetailsComponent);
    return InventoryReceiptDetailsComponent;
}());
exports.InventoryReceiptDetailsComponent = InventoryReceiptDetailsComponent;
