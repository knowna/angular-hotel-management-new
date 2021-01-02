import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { SaleBookDate } from 'src/app/Model/SaleBook';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';
import { Global } from 'src/app/Shared/global';
import * as XLSX from 'xlsx';
//generating pdf
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';

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
    toExportFileName: string = 'Sales Date Wise-' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
    toPdfFileName: string = 'Sales Date Wise-' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';

    public fromDate: any;
    public toDate: any;

    /**
     * Sale Book Constructor
     */
    constructor(private _journalvoucherService: JournalVoucherService, private modalService: BsModalService, private date: DatePipe) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
        this.fromDate = this.currentYear['NepaliStartDate'];
        this.toDate = this.currentYear['NepaliEndDate'];

        this.SearchLedgerTransaction(this.fromDate, this.toDate);
    }

    SearchLedgerTransaction(sfromdate: string, stodate: string) {
        this.isLoading = true;
        if (sfromdate == "undefined" || sfromdate == null) {
            alert("Enter Start Date");
            return false;
        }
        if (stodate == "undefined" || stodate == null) {
            alert("Enter End Date");
            return false;
        }
        if (this.nepaliDateStringValidator(stodate) === false) {
            alert("Enter Valid End Date");
            return false;
        }
        if (this.nepaliDateStringValidator(sfromdate) === false) {
            alert("Enter Valid Start Date");
            return false;
        }

        this.fromDate = sfromdate;
        this.toDate = stodate;

        this._journalvoucherService.get(Global.BASE_ACCOUNTSALEBOOK_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&Item=Item' + '&date=date' + '&sale=sale')
            .subscribe(SB => {
                this.SaleBooks = SB; this.isLoading = false;
            },
                error => this.msg = <any>error);
    }

    nepaliDateStringValidator(control: string) {
        let pattern = new RegExp(/(^[0-9]{4})\.([0-9]{2})\.([0-9]{2})/g);
        let isValid = pattern.test(control);
        if (!isValid) {
            return false;
        }
        else {
            return true;
        }
    }

    exportTableToPdf(){
        var doc = new jsPDF("p", "mm", "a4");
        var rows = [];
        let sn = 1;

        rows.push(['S.No','Date','Invoice No','Name','Pan No','Amount']);

        this.SaleBooks.forEach(SaleBook => {
            var tempSaleBook = [
                sn,
                this.date.transform(SaleBook.VDate,'yyyy.MM.dd'),
                SaleBook.BillNo,
                SaleBook.BuyerName,
                SaleBook.BuyerPAN,
                SaleBook.TotalSale.toFixed(2)
            ];

            sn = sn * 1 + 1;

            rows.push(tempSaleBook);

            rows.push(['','Name','Qty (UT)','Rate','Amount',''])

            SaleBook.SalesBillItems.forEach(IRItemName => {
                var tempIRItemName = [
                    '',
                    IRItemName.ItemName,
                    IRItemName.Quantity,
                    IRItemName.Rate,
                    IRItemName.Amount.toFixed(2),
                    ''
                ];

                rows.push(tempIRItemName);
            });
        });

        doc.setFontSize(14);
        doc.text(80,20, `${this.company?.NameEnglish}`);
        doc.text(87,30,'Sales Book');
        doc.text(80,40,`${this.date.transform(this.fromDate,'yyyy.MM.dd')} - ${this.date.transform(this.toDate,'yyyy.MM.dd')}`);

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
              5: {
                  halign: 'right',
                },
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
        // filename = filename ? filename + '.xls' : 'Account Sale Book Date wise of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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