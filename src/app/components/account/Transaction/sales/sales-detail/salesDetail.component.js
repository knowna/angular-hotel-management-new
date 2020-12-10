"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SalesDetailComponent = /** @class */ (function () {
    function SalesDetailComponent(_purchaseService) {
        var _this = this;
        this._purchaseService = _purchaseService;
        this._purchaseService.getSalesItems().subscribe(function (data) {
            _this.inventoryItem = data;
        });
    }
    // Calculate Purchase Amount
    SalesDetailComponent.prototype.calculateAmount = function (SaleOrderDetails) {
        return SaleOrderDetails.TotalAmount.setValue(SaleOrderDetails.Qty.value * SaleOrderDetails.UnitPrice.value);
    };
    SalesDetailComponent.prototype.updateRate = function (Id) {
        console.log(Id);
        var rate = this.inventoryItem.filter(function (item) {
            return item.Id === Id;
        })[0];
        if (rate) {
            this.SaleOrderDetails.controls['UnitPrice'].setValue(rate);
        }
    };
    __decorate([
        core_1.Input('group')
    ], SalesDetailComponent.prototype, "SaleOrderDetails", void 0);
    SalesDetailComponent = __decorate([
        core_1.Component({
            selector: 'my-salesDetail-list',
            templateUrl: './salesDetail.component.html'
        })
    ], SalesDetailComponent);
    return SalesDetailComponent;
}());
exports.SalesDetailComponent = SalesDetailComponent;
