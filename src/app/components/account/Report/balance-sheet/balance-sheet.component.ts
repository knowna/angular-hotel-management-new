import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { Global } from 'src/app/Shared/global';
import { CategorysService } from '../../services/Category.services';

@Component({
    templateUrl: './balance-sheet.component.html',
    styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit {
    currentYear: any;
    currentUser: any;
    company: any;
    balanceSheet: any;
    msg: string;
    isLoading: boolean = false;

    constructor(
        private _categoryService: CategorysService,
        private date: DatePipe
    ) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
    }

    ngOnInit(): void {
        this.loadBalanceSheet();
    }
    
    /**
     * Loads the balance sheet data
     */
    loadBalanceSheet(): void {
        this.isLoading = true;
        this._categoryService.get(Global.BASE_BALANCE_SHEET_ENDPOINT + "?FinancialYear=" + (this.currentYear['Name'] || ''))
            .subscribe(
                balanceSheet => { 
                    this.balanceSheet = balanceSheet; 
                    this.isLoading = false; 
                },
                error => this.msg = <any>error
            );
    }

    /**
     * Caltulate the total from the list of items
     */
    calculateTotal (arraydata: any[]) : string {
        if (arraydata.length) {
            return arraydata.reduce(function(total, currentValue) {
                return total + currentValue.Amount;
            }, 0);
        }
        else {
            return (0).toFixed(2);
        }
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
        filename = filename ? filename + '.xls' : 'Balance Sheet of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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
