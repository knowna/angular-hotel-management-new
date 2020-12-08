"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var PurchaseDetailsComponent = /** @class */ (function () {
    function PurchaseDetailsComponent(_purchaseService) {
        var _this = this;
        this._purchaseService = _purchaseService;
        this._purchaseService.getInventoryItems().subscribe(function (data) {
            debugger;
            _this.inventoryItem = data;
        });
    }
    // calculate Purchase Amount//
    PurchaseDetailsComponent.prototype.calculateAmount = function (purchaseDetails) {
        debugger;
        return purchaseDetails.PurchaseAmount.setValue(purchaseDetails.Quantity.value * purchaseDetails.PurchaseRate.value);
    };
    __decorate([
        core_1.Input('group')
    ], PurchaseDetailsComponent.prototype, "purchaseDetails", void 0);
    PurchaseDetailsComponent = __decorate([
        core_1.Component({
            selector: 'my-purchaseDetail-list',
            templateUrl: './purchaseDetail.component.html'
        })
    ], PurchaseDetailsComponent);
    return PurchaseDetailsComponent;
}());
exports.PurchaseDetailsComponent = PurchaseDetailsComponent;
