import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ViewInventoryItem } from '../../../Model/Inventory/stock-in-hand';
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';
import { Global } from '../../../Shared/global';

@Component({
    templateUrl: './stock-in-hand.component.html'
})

export class StockInHandComponent implements OnInit {
    currentYear: any;
    currentUser: any;
    company: any;
    ViewInventoryItems: ViewInventoryItem;
    msg: string;
    indLoading: boolean = false;

    constructor(
        private date: DatePipe,
        private _inventoryService: AccountTransactionTypeService,
    ) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
    }

    ngOnInit(): void {
        this.LoadInventoryItems();
    }

    LoadInventoryItems(): void {
        this.indLoading = true;
        this._inventoryService.get(Global.BASE_STOCKINHAND_ENDPOINT + "?FinancialYear=" + (this.currentYear['Name'] || ''))
            .subscribe(InventoryItems => {
                 
                this.ViewInventoryItems = InventoryItems;
                this.indLoading = false;
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