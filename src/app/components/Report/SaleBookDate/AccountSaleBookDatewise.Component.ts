import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { SaleBookDate } from '../../../Model/SaleBook';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global'  ;
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';

import { DatePipe } from '@angular/common';

@Component({
    templateUrl: './AccountSaleBookDatewise.Component.html'
})

export class AccountSaleBookDaywise {
    currentYear: any;
    currentUser: any;
    company: any;
    SaleBooks: SaleBookDate[];
    msg: string;
    isLoading: boolean = false;
    modalRef: BsModalRef;
    selectedMonths: any = null;
    /**
     * Sale Book Constructor
     */
    constructor(private _journalvoucherService:   AccountTransactionTypeService, private modalService: BsModalService, private date: DatePipe) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
    }
    public fromDate: any;
    public toDate: any;

    SearchLedgerTransaction() {
        this.isLoading = true;
        this._journalvoucherService.get(Global.BASE_ACCOUNTSALEBOOK_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&Item=Item' + '&date=date' + '&sale=sale')
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
        filename = filename ? filename + '.xls' : 'Account Sale Book Date wise of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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
    changefromDate(event: any) {
        
        let vardate = event.getDate();
        let varmonth = event.getMonth();
        let varYear = event.getFullYear();
        let fulldate = vardate + "-" + varmonth + "-" + varYear;
        console.log(event);
    }
    changeToDate(event: any) {
        
        let vardate = event.getDate();
        let varmonth = event.getMonth();
        let varYear = event.getFullYear();
        let fulldate = vardate + "-" + varmonth + "-" + varYear;
        console.log(event);
    }
}