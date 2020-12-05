import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { MaterializedView } from 'src/app/Model/materializedview';
import { NepaliMonth } from 'src/app/Model/NepaliMonth';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';
import { Global } from 'src/app/Shared/global';

@Component({
    templateUrl: './materializedview.Component.html'
})

export class MaterializedViewComponent {
    currentYear: any;
    currentUser: any;
    company: any;
    materializedViews: MaterializedView[];
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
        this._journalvoucherService.get(Global.BASE_ACCOUNT_MaterializedView_ENDPOINT + '?Month=' + CurrentMonth + "&&FinancialYear=" + (this.currentYear['Name']))
            .subscribe(SB => {
                this.materializedViews = SB; this.isLoading = false;
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
}