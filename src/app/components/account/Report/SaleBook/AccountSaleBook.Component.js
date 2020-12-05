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
var AccountSaleBookComponent = /** @class */ (function () {
    /**
     * Sale Book Constructor
     */
    function AccountSaleBookComponent(_journalvoucherService, modalService) {
        var _this = this;
        this._journalvoucherService = _journalvoucherService;
        this.modalService = modalService;
        this.isLoading = false;
        this._journalvoucherService.getAccounts().subscribe(function (data) { _this.accountledger = data; });
    }
    ///**
    // * Overrides OnInit component
    // */
    AccountSaleBookComponent.prototype.SearchLedgerTransaction = function (CurrentMonth) {
        var _this = this;
        debugger;
        this.isLoading = true;
        this._journalvoucherService.get(global_1.Global.BASE_ACCOUNTSALEBOOK_ENDPOINT + '?Month=' + CurrentMonth)
            .subscribe(function (SB) {
            _this.SaleBooks = SB;
            _this.isLoading = false;
        }, function (error) { return _this.msg = error; });
        return this.SaleBooks;
    };
    AccountSaleBookComponent.prototype.calcTotalSale = function (SaleBooks) {
        debugger;
        var TotalSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalSale = TotalSale + parseFloat(SaleBooks[i].TotalSale);
        }
        return TotalSale;
    };
    AccountSaleBookComponent.prototype.calcNonTaxableSaleTotal = function (SaleBooks) {
        debugger;
        var TotalTaxableSaleSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalTaxableSaleSale = TotalTaxableSaleSale + parseFloat(SaleBooks[i].NonTaxableSale);
        }
        return TotalTaxableSaleSale;
    };
    AccountSaleBookComponent.prototype.calcExportSaleTotal = function (SaleBooks) {
        debugger;
        var TotalExportSaleSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalExportSaleSale = TotalExportSaleSale + parseFloat(SaleBooks[i].ExportSale);
        }
        return TotalExportSaleSale;
    };
    AccountSaleBookComponent.prototype.calcDiscountTotal = function (SaleBooks) {
        debugger;
        var TotalDiscountSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalDiscountSale = TotalDiscountSale + parseFloat(SaleBooks[i].Discount);
        }
        return TotalDiscountSale;
    };
    AccountSaleBookComponent.prototype.calcTaxableAmountTotal = function (SaleBooks) {
        debugger;
        var TotalTaxableAmountSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalTaxableAmountSale = TotalTaxableAmountSale + parseFloat(SaleBooks[i].TaxableAmount);
        }
        return TotalTaxableAmountSale;
    };
    AccountSaleBookComponent.prototype.calcTaxAmountTotal = function (SaleBooks) {
        debugger;
        var TotalTaxAmountSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalTaxAmountSale = TotalTaxAmountSale + parseFloat(SaleBooks[i].Tax);
        }
        return TotalTaxAmountSale;
    };
    AccountSaleBookComponent = __decorate([
        core_1.Component({
            templateUrl: './AccountSaleBook.Component.html'
        })
    ], AccountSaleBookComponent);
    return AccountSaleBookComponent;
}());
exports.AccountSaleBookComponent = AccountSaleBookComponent;
