import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params } from "@angular/router";
import 'rxjs/add/operator/switchMap';
import { Global } from 'src/app/Shared/global';
import { LedgerView } from 'src/app/Model/LedgerView';
import { Account } from 'src/app/Model/Account/account';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';

import * as XLSX from 'xlsx';
//generating pdf
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';

@Component({
    templateUrl: './AccountLedgerView.Component.html'
})

export class AccountLedgerViewComponent {
    currentYear: any;
    currentUser: any;
    company: any;
    LedgerViews: LedgerView[];
    msg: string;
    inLoading: boolean = false;
   // public accountledger: Observable<Account>;
    public accountledger: Account[];
    public accountSingleledger: Account;
    modalRef: BsModalRef;
    selectedName: any = "";

    toExportFileName: string = 'Account Ledger View-' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
    toPdfFileName: string = 'Account Ledger View-' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';

/**
     * Ledger View Constructor
     */
    constructor(
        private _journalvoucherService: JournalVoucherService,
        private modalService: BsModalService,
        private date: DatePipe,
        private route: ActivatedRoute,
    ) {
        this._journalvoucherService.getAccounts()
            .subscribe(data => { 
                this.accountledger = data;
                console.log('the account', this.accountledger)
            });
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
    }

    selectedAccountName() {
        return this.accountledger.find(x => x.Id == this.selectedName).Name;
    }
    /**
     * Overrides OnInit component
     */
    SearchLedgerTransaction(Id: string) {
        this.inLoading = true;
        this._journalvoucherService.get(Global.BASE_ACCOUNTLEDGERVIEW_ENDPOINT + '?LedgerId=' + Id + "&&FinancialYear=" + (this.currentYear['Name']))
            .subscribe(LV => {
                this.LedgerViews = LV; this.inLoading = false;
            },
            error => this.msg = <any>error);
        return this.LedgerViews;
    }

    exportTableToPdf() {
        var doc = new jsPDF("p", "mm", "a4");
        var rows = [];
        let sn = 1;

        rows.push(['Date','Particular','Voucher Type','Voucher No','Debit Amount','Credit Amount']);

        this.LedgerViews.forEach(ledger => {
            var tempLedger = [
                ledger.VDate,
                ledger.Name,
                ledger.VType,
                ledger.VNumber,
                ledger.Debit > 0 ? ledger.Debit.toFixed(2) : '',
                ledger.Credit > 0 ? ledger.Debit.toFixed(2) : '',
            ];

            rows.push(tempLedger);
        });

        
        rows.push([
            'Total',
            '',
            '',
            '',
            this.calcDebitTotal(this.LedgerViews).toFixed(2),
            this.calcCreditTotal(this.LedgerViews).toFixed(2)
        ])

        rows.push([
            'Closing Balance',
            '',
            '',
            '',
            this.calcLedgerTotal(this.LedgerViews).toFixed(2) > 0+'' ? this.calcLedgerTotal(this.LedgerViews).toFixed(2)+' Debit' : '',
            this.calcLedgerTotal(this.LedgerViews).toFixed(2) < 0+'' ? this.calcLedgerTotal(this.LedgerViews).toFixed(2)+ ' Credit' : ''
        ]);


        let account =  this.accountledger.find(x => x.Id == this.selectedName);

        doc.setFontSize(14);
        doc.text(80,20, `${this.company?.NameEnglish}`);
        doc.text(87,30,'Ledger View');
        doc.text(80,40,'Account : ' + account.Name);

        doc.autoTable({
            margin: {left: 10,bottom:20},
            setFontSize: 14,
    
            //for next page 
            startY: doc.pageCount > 1? doc.autoTableEndPosY() + 20 : 50,
            rowPageBreak: 'avoid',
            body: rows,
            bodyStyles: {
            fontSize: 9,
            },
            columnStyles: {
                0: {cellWidth: 30},
                1: {cellWidth: 30},
                2: {cellWidth: 30},
                3: {cellWidth: 30},
                4: {
                    cellWidth: 30,
                    halign: 'right',
                },
                5: {
                    cellWidth: 30,
                    halign: 'right',
                }
            },
    
            // customize table header and rows format
            theme: 'striped'
        });

        const pages = doc.internal.getNumberOfPages();
        const pageWidth = doc.internal.pageSize.width;  //Optional
        const pageHeight = doc.internal.pageSize.height;  //Optional
        doc.setFontSize(10);  //Optional

        for(let j = 1; j < pages + 1 ; j++) {
            let horizontalPos = pageWidth / 2;  //Can be fixed number
            let verticalPos = pageHeight - 10;  //Can be fixed number
            doc.setPage(j);
            doc.text(`${j} of ${pages}`, horizontalPos, verticalPos, {align: 'center' }); //Optional text styling});
        }

        doc.save(this.toPdfFileName);
    }

    exportTableToExcel(tableID, filename = '') {
        // var downloadLink;
        // var dataType = 'application/vnd.ms-excel';
        // var clonedtable = $('#' + tableID);
        // var clonedHtml = clonedtable.clone();
        // $(clonedtable).find('.export-no-display').remove();
        // var tableSelect = document.getElementById(tableID);
        // var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        // $('#' + tableID).html(clonedHtml.html());

        // // Specify file name
        // filename = filename ? filename + '.xls' : 'Account Ledger View of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

        // // Create download link element
        // downloadLink = document.createElement("a");

        // document.body.appendChild(downloadLink);

        // if (navigator.msSaveOrOpenBlob) {
        //     var blob = new Blob(['\ufeff', tableHTML], { type: dataType });
        //     navigator.msSaveOrOpenBlob(blob, filename);
        // } else {
        //     // Create a link to the file
        //     downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

        //     // Setting the file name
        //     downloadLink.download = filename;

        //     //triggering the function
        //     downloadLink.click();
        // }
        let element = document.getElementById(tableID); 
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.toExportFileName);
    }

    calcDebitTotal(LedgerViews) {
        var TotalDebit = 0;
        for (var i = 0; i < LedgerViews.length; i++) {
            TotalDebit = TotalDebit + parseFloat(LedgerViews[i].Debit);
        }
        return TotalDebit;
    }

    calcCreditTotal(LedgerViews) {
        var TotalCredit = 0;
        for (var i = 0; i < LedgerViews.length; i++) {
            TotalCredit = TotalCredit + parseFloat(LedgerViews[i].Credit);
        }
        return TotalCredit;
    }

    calcLedgerTotal(LedgerViews) {
        var TotalCredit = 0;
        var TotalDebit = 0;
        for (var i = 0; i < LedgerViews.length; i++) {
            TotalCredit = TotalCredit + parseFloat(LedgerViews[i].Credit);
            TotalDebit = TotalDebit + parseFloat(LedgerViews[i].Debit);
        }
        var TotalBalance = TotalDebit - TotalCredit;
        return TotalBalance;
    }

    //selectedStatus: any
    //public setSelectedStatus(value: string): void {
    //    if (this.accountSingleledger && value) {
    //        let status: Account = this.accountSingleledger.find(s => s.Name == value);
    //        if (status)
    //            this.selectedStatus = status.Name;
    //    }
    //    else
    //        this.selectedStatus = '';
    //}

    //getAccountladgerName(Id: number) {
    //    debugger
    //    this.SearchLedgerTransaction = this.SearchLedgerTransaction.find(data => data.Id === Id);
    //    this.accountledger = this.accountledger.filter((data) => data.Id === Id);
    //    return this.accountledger ? this.accountledger[0] : {};
    //}
}
