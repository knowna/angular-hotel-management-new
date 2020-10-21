"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var global_1 = require("../../../Shared/global");
var StockDamageDetailsComponent = /** @class */ (function () {
    function StockDamageDetailsComponent(fb, _pcitemService, _menuConsumptionService) {
        var _this = this;
        this.fb = fb;
        this._pcitemService = _pcitemService;
        this._menuConsumptionService = _menuConsumptionService;
        this._menuConsumptionService.getMenuConsumptionProductPortions().subscribe(function (data) { return _this.MenuItemPortions = data; });
    }
    //total item and total cost
    StockDamageDetailsComponent.prototype.postToApi = function (pcDetails) {
        var _this = this;
         
        var itemId = this.pcDetails.controls['InventoryItemId'].value;
        var sum = this._pcitemService.get(global_1.Global.BASE_PERIODICCONSUMPTIONITEM_ENDPOINT + itemId).subscribe(function (data) {
            _this.imenuitemPortion = data;
            return pcDetails.InStock.setValue(_this.imenuitemPortion);
        });
        var cost = this._pcitemService.getCost(global_1.Global.BASE_COSTDETAILS_ENDPOINT + itemId).subscribe(function (data) {
             
            _this.inventorycost = data;
        });
    };
    //calculate net consumption
    StockDamageDetailsComponent.prototype.calculateNetConsumption = function (pcDetails, InStockValue, invnCost) {
        var _this = this;
        var itemId = this.pcDetails.controls['InventoryItemId'].value;
        var netConsumption = this._pcitemService.getConsum(global_1.Global.BASE_PERIODICCONSUMPTIONITEM_ENDPOINT + itemId).subscribe(function (data) {
             
            _this.imenuitemPortion = data;
            return pcDetails.InStock.setValue(_this.imenuitemPortion);
        });
         
        InStockValue = this.imenuitemPortion;
        invnCost = this.inventorycost;
        return (pcDetails.PhysicalInventory.setValue(InStockValue - pcDetails.Consumption.value)),
            (pcDetails.Cost.setValue(invnCost * pcDetails.Consumption.value));
    };
    //Calculates InStock values
    StockDamageDetailsComponent.prototype.calculateInStock = function (pcDetails, invnQuantitySum) {
        var _this = this;
         
        if (pcDetails.InventoryItemId == 0) {
            invnQuantitySum = this.imenuitemPortion;
            return pcDetails.InStock.setValue(invnQuantitySum);
        }
        else {
             
            var itemId = this.pcDetails.controls['InventoryItemId'].value;
            var netConsumption = this._pcitemService.getConsum(global_1.Global.BASE_PERIODICCONSUMPTIONITEM_ENDPOINT + itemId).subscribe(function (data) {
                _this.imenuitemPortion = data;
                return pcDetails.InStock.setValue(_this.imenuitemPortion);
            });
        }
    };
    //Calculates PhysicalInventory
    StockDamageDetailsComponent.prototype.getPhysicalInventory = function (pcDetails, InStockValue) {
        InStockValue = this.imenuitemPortion;
        return pcDetails.PhysicalInventory.setValue(InStockValue - pcDetails.Consumption.value);
    };
    //Correct Calculates Cost
    StockDamageDetailsComponent.prototype.getCost = function (pcDetails, invnCost) {
        invnCost = this.inventorycost;
        return pcDetails.Cost.setValue(invnCost * pcDetails.Consumption.value);
    };
    __decorate([
        core_1.Input('group')
    ], StockDamageDetailsComponent.prototype, "pcDetails", void 0);
    StockDamageDetailsComponent = __decorate([
        core_1.Component({
            selector: 'stock-damage-details',
            templateUrl: './stock-damage-details.component.html'
        })
    ], StockDamageDetailsComponent);
    return StockDamageDetailsComponent;
}());
exports.StockDamageDetailsComponent = StockDamageDetailsComponent;
