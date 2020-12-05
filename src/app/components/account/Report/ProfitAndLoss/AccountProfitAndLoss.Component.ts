import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JournalVoucherService } from '../../../Service/journalVoucher.service';

import { ProfitAndLoss } from '../../../Model/ProfitAndLoss';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';
import { DatePipe } from '@angular/common';

@Component({
    templateUrl: './AccountProfitAndLoss.Component.html'
})

export class AccountProfitAndLossComponent implements OnInit {
    currentYear: any;
    currentUser: any;
    company: any;
    profitandloss: ProfitAndLoss[];
    msg: string;
    inLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;

    constructor(
        private _ProfitAndLossService: JournalVoucherService,
        private modalService: BsModalService,
        private date: DatePipe
    ) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
    }

    ngOnInit(): void {
        this.LoadProfitAndLoss();
    }

    LoadProfitAndLoss(): void {
        debugger
        this._ProfitAndLossService.get(Global.BASE_ACCOUNTPROFITANDLOSS_ENDPOINT + "?FinancialYear=" + (this.currentYear['Name'] || ''))
            .subscribe(ProfitAndLosss => { debugger; this.profitandloss = ProfitAndLosss; this.inLoading = false; },
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
        filename = filename ? filename + '.xls' : 'Profit and Loss of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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
}