import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { Global } from 'src/app/Shared/global';
import { SaleBook } from 'src/app/Model/SaleBook';
import { NepaliMonth } from 'src/app/Model/NepaliMonth';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';

@Component({
    templateUrl: './AccountSaleBook.Component.html'
})

export class AccountSaleBookComponent {
    currentYear: any;
    currentUser: any;
    company: any;
    SaleBooks: SaleBook[];
    msg: string;
    isLoading: boolean = false;
    public Months: Observable<NepaliMonth>;
    modalRef: BsModalRef;
    selectedMonths: any = "";
    /**
     * Sale Book Constructor
     */
    constructor(private _journalvoucherService: JournalVoucherService, private modalService: BsModalService, private date: DatePipe) {
        this._journalvoucherService.getAccountMonths().subscribe(data => { this.Months = data });
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
    }

    SearchLedgerTransaction(CurrentMonth: string) {
        this.isLoading = true;
        this._journalvoucherService.get(Global.BASE_ACCOUNTSALEBOOK_ENDPOINT + '?Month=' + CurrentMonth + "&&FinancialYear=" + (this.currentYear['Name']))
            .subscribe(SB => {
                this.SaleBooks = SB; this.isLoading = false;
            },
                error => this.msg = <any>error);
    }

    exportTableToExcel(tableID, filename = '') {
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
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }

    calcTotalSale(SaleBooks) {
        var TotalSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalSale = TotalSale + parseFloat(SaleBooks[i].TotalSale);
        }
        return TotalSale;
    }
    calcNonTaxableSaleTotal(SaleBooks) {
        var TotalTaxableSaleSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalTaxableSaleSale = TotalTaxableSaleSale + parseFloat(SaleBooks[i].NonTaxableSale);
        }
        return TotalTaxableSaleSale;
    }
    calcExportSaleTotal(SaleBooks) {
        var TotalExportSaleSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalExportSaleSale = TotalExportSaleSale + parseFloat(SaleBooks[i].ExportSale);
        }
        return TotalExportSaleSale;
    }
    calcDiscountTotal(SaleBooks) {
        var TotalDiscountSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalDiscountSale = TotalDiscountSale + parseFloat(SaleBooks[i].Discount);
        }
        return TotalDiscountSale;
    }
    calcTaxableAmountTotal(SaleBooks) {
        var TotalTaxableAmountSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalTaxableAmountSale = TotalTaxableAmountSale + parseFloat(SaleBooks[i].TaxableAmount);
        }
        return TotalTaxableAmountSale;
    }
    calcTaxAmountTotal(SaleBooks) {
        var TotalTaxAmountSale = 0;
        for (var i = 0; i < SaleBooks.length; i++) {
            TotalTaxAmountSale = TotalTaxAmountSale + parseFloat(SaleBooks[i].Tax);
        }
        return TotalTaxAmountSale;
    }
}