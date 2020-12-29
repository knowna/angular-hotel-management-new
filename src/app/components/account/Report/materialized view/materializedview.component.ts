import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { MaterializedView } from 'src/app/Model/materializedview';
import { NepaliMonth } from 'src/app/Model/NepaliMonth';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';
import { Global } from 'src/app/Shared/global';

import * as XLSX from 'xlsx';
//generating pdf
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';

@Component({
    templateUrl: './materializedview.component.html'
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

    toExportFileName: string = 'Materialized View-' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
    toPdfFileName: string = 'Materialized View-' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';

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
        // var downloadLink;
        // var dataType = 'application/vnd.ms-excel';
        // var clonedtable = $('#' + tableID);
        // var clonedHtml = clonedtable.clone();
        // $(clonedtable).find('.export-no-display').remove();
        // var tableSelect = document.getElementById(tableID);
        // var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        // $('#' + tableID).html(clonedHtml.html());

        // // Specify file name
        // filename = filename ? filename + '.xls' : 'Account Sale Book of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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

    exportTableToPdf() {
        var doc = new jsPDF("l", "mm", "a4");
        var rows = [];
        let sn = 1;

        rows.push(['Invoice','','','','','','','','','','','','','Total Amount','Amount MaterializedView','Discount','Taxable MaterializedView','']);

        rows.push(['Date','Bill No','Customer Name','Customer Pan','Entered By', 'Fiscal_Year','Is bill Active','IS BillPrinted','Is realtime','Printed by','Printed Time','Sync with IRD','(Rs.)','(Rs.)','(Rs.)','(Rs.)','Taxable_Amount (Rs.)','Tax_Amount (Rs.)']);


        this.materializedViews.forEach(MView => {
            var tempMView = [
                this.date.transform(MView.Bill_Date,'yyyy.MM.dd'),
                MView.Bill_no,
                MView.Customer_name,
                MView.Customer_Pan,
                MView.Entered_By,
                MView.Fiscal_Year,
                MView.Is_bill_Active,
                MView.IS_Bill_Printed,
                MView.Is_realtime,
                MView.Printed_by,
                this.date.transform(MView.Printed_Time,'yyyy.MM.dd'),
                MView.Sync_with_IRD,
                '',
                MView.Total_Amount.toFixed(2),
                MView.Amount.toFixed(2),
                MView.Discount.toFixed(2),
                MView.Taxable_Amount.toFixed(2),
                MView.Tax_Amount.toFixed(2),
            ];

            rows.push(tempMView);
        });

        doc.setFontSize(14);
        doc.text(120,20, `${this.company?.NameEnglish}`);
        doc.text(120,30,this.selectedMonths + ' Materialized View');
        doc.text(120,40,`${this.date.transform(this.currentYear?.NepaliStartDate,'yyyy.MM.dd')} - ${this.date.transform(this.currentYear?.NepaliEndDate,'yyyy.MM.dd')}`);

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
}