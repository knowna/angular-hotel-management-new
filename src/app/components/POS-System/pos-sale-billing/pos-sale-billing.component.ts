import { Component, OnInit, Input } from '@angular/core';
import { Order, OrderItem, OrderItemRequest } from '../../../Model/order.model';
import { SaleBillingBook } from '../../../Model/SaleBook';
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';
import { Global } from '../../../Shared/global';
import { DatePipe } from '@angular/common';
import { AccountTrans } from '../../../Model/AccountTransaction/accountTrans';
type CSV = any[][];
declare var $: any;
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Ticket, PaymentHistory } from '../../../Model/ticket.model';
import * as OrderSelector from '../../../selectors/order.selector';
import * as TicketSelector from '../../../selectors/ticket.selector';
import { ActivatedRoute } from '@angular/router';
import { OrderStoreService } from '../../../Service/store/order.store.service';

@Component({
    selector: 'pos-sale-billing',
    templateUrl: 'pos-sale-billing.component.html',
})

export class POSSaleBillingComponent implements OnInit {
    currentYear: any;
    currentUser: any;
    company: any;
    salebillingbook: SaleBillingBook[];
    indLoading: boolean = false;
    msg: string;
    public fromDate: any;
    public toDate: any;
    public sfromDate: string;
    public stoDate: string;
    @Input('orders') orders: Order[];
    toExportFileName: string = 'pos sales billing of ' + this.date.transform(new Date, "dd-MM-yyyy") + '.xls';
    uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
    selectedTicket: number;
    orders$: Observable<Order[]>;
    ticket$: Observable<Ticket>;
    ticket: Ticket = { TotalAmount: 0, Discount: 0 };
    ticketNote: string;
    parsedOrders: Order[] = [];
    totalPayable: any = '';
    selectedCustomerId: number = 0;
    OrderItem: OrderItem[];
    constructor(
        private _reservationService: AccountTransactionTypeService,
        private date: DatePipe,
        private activatedRoute: ActivatedRoute,
    ) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
        this.fromDate = this.currentYear['NepaliStartDate'];
        this.toDate = this.currentYear['NepaliEndDate'];
    }

    ngOnInit() {
    }

    /**
   *  Get the list of filtered journals by the form and to date
   */
    filterJournalByDate(sfromdate: string, stodate: string) {
        
        if (sfromdate == "undefined" || sfromdate == null) {
            alert("Enter Start Date");
            return false;
        }
        if (stodate == "undefined" || stodate == null) {
            alert("Enter End Date");
            return false;
        }
        if (this.nepaliDateValidator(stodate) === false) {
            alert("Enter Valid End Date");
            return false;
        }
        if (this.nepaliDateValidator(sfromdate) === false) {
            alert("Enter Valid Start Date");
            return false;
        }
        this.fromDate = sfromdate;
        this.toDate = stodate;
        this.sfromDate = sfromdate;
        this.stoDate = stodate;
        this.indLoading = true;
        this._reservationService.get(Global.BASE_POSBILLING_API_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionTypeId=' + 3)
            .subscribe(data => {
                this.indLoading = false;
                this.salebillingbook = data;
            },
            error => this.msg = <any>error);
    }

    getCalcSum(salebillingbook) {
            var BillTotal = 0;
            for (var i = 0; i < salebillingbook.length; i++) {
                BillTotal = BillTotal + parseFloat(salebillingbook[i].BillTotal);
            }
            return BillTotal;
    }

    getCalcDiscount(salebillingbook) {
        
        var Discount = 0;
        for (var i = 0; i < salebillingbook.length; i++) {
            Discount = Discount + parseFloat(salebillingbook[i].Discount);
        }
        return Discount;
    }
   
    getCalcServiceCharge(salebillingbook) {
        var ServiceCharge = 0;
        for (var i = 0; i < salebillingbook.length; i++) {
            ServiceCharge = ServiceCharge + parseFloat(salebillingbook[i].ServiceCharge);
        }
        return ServiceCharge;
    }

    getCalcVatAmount(salebillingbook) {
        var Tax = 0;
        for (var i = 0; i < salebillingbook.length; i++) {
            Tax = Tax + parseFloat(salebillingbook[i].Tax);
        }
        return Tax;
    }

    getCalcGrandTotal(salebillingbook) {
        var GrandTotal = 0;
        for (var i = 0; i < salebillingbook.length; i++) {
            GrandTotal = GrandTotal + parseFloat(salebillingbook[i].GrandTotal);
        }
        return GrandTotal;
    }

    /**
    * Exports the pOrder voucher data in CSV/ Excel format
    */
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
        filename = filename ? filename + '.xls' : this.toExportFileName;

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
    nepaliDateValidator(nepaliDate: string) {
        let pattern = new RegExp(/(^[0-9]{4})\.([0-9]{2})\.([0-9]{2})/g);
        let isValid = pattern.test(nepaliDate);
        if (!isValid) {
            return false;
        }
        else {
            return true;
        }
    }
}