﻿import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { Global } from 'src/app/Shared/global';
import { SaleBook } from 'src/app/Model/SaleBook';
import { NepaliMonth } from 'src/app/Model/NepaliMonth';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';

import * as XLSX from 'xlsx';
//generating pdf
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';

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

    toExportFileName: string = 'Sales Book-' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
    toPdfFileName: string = 'Sales Book-' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';

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

    exportTableToPdf() {
        var doc = new jsPDF("p", "mm", "a4");
        var rows = [];
        let sn = 1;


        rows.push(['Invoice','','','','Total Sales','Non Taxable Sales','Export Sales','Discount','Taxable Sales','']);

        rows.push(['Date','Bill No.',"Buyer's Name","Buyer's PAN Number",'(Rs.)','(Rs.)','(Rs.)','(Rs.)','Amount(Rs.)','Tax(Rs.)']);


        this.SaleBooks.forEach(SaleBook => {
            var tempSaleBook = [
                this.date.transform(SaleBook.VDate, 'yyyy.MM.dd'),
                SaleBook.BillNo,
                SaleBook.BuyerName,
                SaleBook.BuyerPAN,
                SaleBook.TotalSale.toFixed(2),
                SaleBook.NonTaxableSale.toFixed(2),
                SaleBook.ExportSale.toFixed(2),
                SaleBook.Discount.toFixed(2),
                SaleBook.TaxableAmount.toFixed(2),
                SaleBook.Tax.toFixed(2)
            ];

            rows.push(tempSaleBook);
        });

        rows.push([
            'Total',
            '',
            '',
            '',
            this.calcTotalSale(this.SaleBooks).toFixed(2),
            this.calcNonTaxableSaleTotal(this.SaleBooks).toFixed(2),
            this.calcExportSaleTotal(this.SaleBooks).toFixed(2),
            this.calcDiscountTotal(this.SaleBooks).toFixed(2),
            this.calcTaxableAmountTotal(this.SaleBooks).toFixed(2),
            this.calcTaxAmountTotal(this.SaleBooks).toFixed(2)
        ]);

        doc.setFontSize(14);
        doc.text(80,20, `${this.company?.NameEnglish}`);
        doc.text(87,30,this.selectedMonths +' Sales Book');
        doc.text(80,40,`${this.currentYear?.NepaliStartDate} - ${this.currentYear?.NepaliEndDate}`);

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