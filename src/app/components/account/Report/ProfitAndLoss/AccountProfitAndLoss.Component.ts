import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { ProfitAndLoss } from 'src/app/Model/ProfitAndLoss';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';
import { Global } from 'src/app/Shared/global';

import * as XLSX from 'xlsx';
//generating pdf
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';

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

    toExportFileName: string = 'Profit and Loss-' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
    toPdfFileName: string = 'Profit and Loss-' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';

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
        this._ProfitAndLossService.get(Global.BASE_ACCOUNTPROFITANDLOSS_ENDPOINT + "?FinancialYear=" + (this.currentYear['Name'] || ''))
            .subscribe(ProfitAndLosss => { this.profitandloss = ProfitAndLosss; this.inLoading = false; },
                error => this.msg = <any>error);
    }

    exportTableToPdf() {
        var doc = new jsPDF("p", "mm", "a4");
        var rows = [];
        let sn = 1;

        rows.push(['Particular','Amount (Rs.)']);

        this.profitandloss.forEach(pl => {
            var tempProfitLoss = [
                pl.Name,
                pl.Amount !=0  ?  pl.Amount.toFixed(2) : ''
            ];  

            rows.push(tempProfitLoss);
        });

        doc.setFontSize(14);
        doc.text(80,20, `${this.company?.NameEnglish}`);
        doc.text(87,30,'Profit and Loss');
        // doc.text(80,40,'Account : ' + account.Name);

        doc.autoTable({
            margin: {left: 10,bottom:20},
            setFontSize: 14,
    
            //for next page 
            startY: doc.pageCount > 1? doc.autoTableEndPosY() + 20 : 40,
            rowPageBreak: 'avoid',
            body: rows,
            bodyStyles: {
                fontSize: 9,
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
        // filename = filename ? filename + '.xls' : 'Profit and Loss of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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
}