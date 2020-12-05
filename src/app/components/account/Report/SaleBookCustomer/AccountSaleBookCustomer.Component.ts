import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JournalVoucherService } from '../../../Service/journalVoucher.service';
import { Account } from '../../../Model/Account/account';
import { SaleBookCustomer } from '../../../Model/SaleBook';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';
import { DatePipe } from '@angular/common';

@Component({
    templateUrl: './AccountSaleBookCustomer.Component.html'
})

export class AccountSaleBookCustomer {
    currentYear: any;
    currentUser: any;
    company: any;
    SaleBooks: SaleBookCustomer[];
    public accountledger: Account[];
    msg: string;
    isLoading: boolean = false;
    modalRef: BsModalRef;
    selectedName: any = null;
    /**
     * Sale Book Constructor
     */
    constructor(private _journalvoucherService: JournalVoucherService, private modalService: BsModalService, private date: DatePipe) {
        this._journalvoucherService.getAccounts().subscribe(data => { this.accountledger = data });
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
    }
    selectedAccountName() {
        return this.accountledger.find(x => x.Id == this.selectedName).Name;
    }
    SearchLedgerTransaction(CurrentLedgerId: string) {
        debugger
        this.isLoading = true;
        this._journalvoucherService.get(Global.BASE_ACCOUNTSALEBOOK_ENDPOINT + '?CustomerId=' + CurrentLedgerId + "&&FinancialYear=" + (this.currentYear['Name']) + "&&CustomerReport=CustomerReport" + "&&report=report")
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
        filename = filename ? filename + '.xls' : 'Account Customer Sale Book of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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
}