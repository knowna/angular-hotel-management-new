import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { BillReturnViewModel } from 'src/app/Model/BIllReturnView';
import { DBOperation } from 'src/app/Shared/enum';
import { AccountService } from '../../services/account.service';
import { Global } from 'src/app/Shared/global';

@Component({
    templateUrl: './BillReturnView.component.html'
})

export class BillReturnViewComponent {
    currentYear: any;
    currentUser: any;
    company: any;
    billReturnViews: BillReturnViewModel[];
    msg: string;
    isLoading: boolean = false;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;

    constructor(private _TrialBalancesService: AccountService, private modalService: BsModalService, private date: DatePipe) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
    }

    ngOnInit(): void {
        this.LoadTrialBalance();
    }

    LoadTrialBalance(): void {
        debugger
        this.isLoading = true;
        this._TrialBalancesService.get(Global.BASE_ACCOUNT_BillReturnView_ENDPOINT + "?FinancialYear=" + (this.currentYear['Name'] || ''))
            .subscribe(billReturnViews => { debugger; this.billReturnViews = billReturnViews; this.isLoading = false; },
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
        filename = filename ? filename + '.xls' : 'Trial Balance of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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

    calcDebitTotal(billReturnViews) {
        debugger
        var TotalDebit = 0;
        for (var i = 0; i < billReturnViews.length; i++) {
            TotalDebit = TotalDebit + parseFloat(billReturnViews[i].excisable_amount);
        }
        return TotalDebit;
    }
    calcCreditTotal(billReturnViews) {
        debugger
        var TotalCredit = 0;
        for (var i = 0; i < billReturnViews.length; i++) {
            TotalCredit = TotalCredit + parseFloat(billReturnViews[i].export_sales);
        }
        return TotalCredit;
    }
}