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
    function AccountSaleBookComponent(_journalvoucherService, modalService, date) {
        var _this = this;
        this._journalvoucherService = _journalvoucherService;
        this.modalService = modalService;
        this.date = date;
        this.isLoading = false;
        this.selectedMonths = null;
        this._journalvoucherService.getAccountMonths().subscribe(function (data) { _this.Months = data; });
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
    }
    AccountSaleBookComponent.prototype.SearchLedgerTransaction = function (CurrentMonth) {
        var _this = this;
        this.isLoading = true;
        this._journalvoucherService.get(global_1.Global.BASE_ACCOUNTSALEBOOK_ENDPOINT + '?Month=' + CurrentMonth + "&&FinancialYear=" + (this.currentYear['Name']))
            .subscribe(function (SB) {
            _this.SaleBooks = SB;
            _this.isLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    AccountSaleBookComponent.prototype.exportTableToExcel = function (tableID, filename) {
        if (filename === void 0) { filename = ''; }
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var clonedtable = $('#' + tableID);
        var clonedHtml = clonedtable.clone();
        $(clonedtable).find('.export-no-display').remove();
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        $('#' + tableID).html(clonedHtml.html());
        // Specify file name
        filename = filename ? filename + '.xls' : 'Account Sale Book of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';
        // Create download link element
        downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], { type: dataType });
            navigator.msSaveOrOpenBlob(blob, filename);
        }
        else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
            // Setting the file name
            downloadLink.download = filename;
            //triggering the function
            downloadLink.click();
        }
    };
    AccountSaleBookComponent.prototype.calcTotalSale = function (SaleBooks) {
        var TotalSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalSale = TotalSale + parseFloat(SaleBooks[i].TotalSale);
        }
        return TotalSale;
    };
    AccountSaleBookComponent.prototype.calcNonTaxableSaleTotal = function (SaleBooks) {
        var TotalTaxableSaleSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalTaxableSaleSale = TotalTaxableSaleSale + parseFloat(SaleBooks[i].NonTaxableSale);
        }
        return TotalTaxableSaleSale;
    };
    AccountSaleBookComponent.prototype.calcExportSaleTotal = function (SaleBooks) {
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
        var TotalTaxableAmountSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalTaxableAmountSale = TotalTaxableAmountSale + parseFloat(SaleBooks[i].TaxableAmount);
        }
        return TotalTaxableAmountSale;
    };
    AccountSaleBookComponent.prototype.calcTaxAmountTotal = function (SaleBooks) {
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
