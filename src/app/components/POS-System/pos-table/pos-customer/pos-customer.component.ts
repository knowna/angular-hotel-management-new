import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

// import { Ticket, PaymentHistory } from '../../../../models/ticket.model';
// import { Order, OrderItem } from '../../../../models/order.model';
// import { Product } from '../../../../models/product.model';
import { Global } from '../../../../Shared/global';
import { IInvoicePrint } from '../../../../Model/InvoicePrint'; 

// Selectors
// import { CustomerStoreService } from '../../../../services/store/customer.store.service';
import * as ProductSelector from '../../../../selectors/product.selector';
import * as TicketSelector from '../../../../selectors/ticket.selector';
import * as OrderSelector from '../../../../selectors/order.selector';

// Services
// import { OrderStoreService } from '../../../../services/store/order.store.service';
// import { TicketStoreService } from '../../../../services/store/ticket.store.service';
// import { PurchaseService } from '../../../../Service/purchase.service';

import { Account } from '../../../../Model/Account/account';
import { Order, OrderItem } from 'src/app/Model/order.model';
import { Product } from 'src/app/Model/product.model';
import { PurchaseService } from 'src/app/Service/Billing/purchase.service';
import { CustomerStoreService } from 'src/app/Service/Billing/customer.store.service';
import { Ticket, PaymentHistory } from 'src/app/Model/ticket.model';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/Service/Billing/order.service';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { tick } from '@angular/core/testing';
import { TicketService } from 'src/app/Service/Billing/ticket.service';

@Component({
    selector: 'app-pos-customer',
    templateUrl: './pos-customer.component.html',
    styleUrls: ['./pos-customer.component.css']
})

export class PosCustomerComponent implements OnInit {
    ticket: Ticket;
    ticket$: Observable<Ticket>;
    public account: Observable<Account>;
    orders$: Observable<Order[]>;
    parsedOrders: Order[] = [];
    products$: Observable<Product[]>;
    invoiceprint: IInvoicePrint;
    public company: any = {};
    public AccountId: Account;
    selectedTicket: number;
    productList:Product[] = [];

    configAccount = {
        displayKey: 'Name', // if objects array passed which key to be displayed defaults to description
        searchOnKey: 'Name',
        search: true,
        limitTo: 1000
    };

    // Constructor
    constructor(
        private store: Store<any>,
        private _location: Location,
        private _purchaseService: PurchaseService,
        private customerStoreService: CustomerStoreService,
        private activatedRoute: ActivatedRoute,
        private orderApi: OrderService,
        private billService: BillingService,
        private ticketService:TicketService
    ) {
        this.company = JSON.parse(localStorage.getItem('company'));
        this.activatedRoute.queryParamMap
            .subscribe(params => {
                this.selectedTicket =  +params.get('ticketId')||0;
                console.log('ticket id', this.selectedTicket);
        });
    }
    ngOnInit() {
        this.billService.loadProducts()
        .subscribe(data => { 
            this.productList = data;
        });

        // this.ticket$ = this.store.select(TicketSelector.getCurrentTicket);
        // this.orders$ = this.store.select(OrderSelector.getAllOrders);
        // this.products$ = this.store.select(ProductSelector.getAllProducts);

        // Subscriptions
        // this.ticket$.subscribe((ticket: Ticket) => {
        //     if (ticket) {
        //         this.ticket = ticket;
        //     }
        // });

        // this.orders$.subscribe((orders: Order[]) => {
        //     if (orders.length) {
        //         this.parsedOrders = this.mergeDuplicateItems(orders);
        //     }
        // });
        if(this.selectedTicket){
            this.orderApi.loadOrdersNew(this.selectedTicket.toString())
                .subscribe(
                    data => {
                        this.parsedOrders = data;
                    }
            );

            this.ticketService.getTicketById(this.selectedTicket)
                .subscribe(
                    data => {
                        this.ticket = data;
                    }
            );
        }
        this.LoadCustomers();
    }
	/**
	 * Item Price
	 * @param UnitPrice 
	 */
    CurrentUnitPrice(UnitPrice: number) {
        // let currentprice = UnitPrice / 1.13;
        // Return product
        return UnitPrice.toFixed(2);
    }
	/**
	 * Item Price
	 * @param UnitPrice 
	 * @param Qty 
	 */
    ProductPrice(UnitPrice: number, Qty: number) {
        // let currentprice = UnitPrice / 1.13 * Qty;
        let currentprice = UnitPrice * Qty;
        // Return product
        return currentprice.toFixed(2);
    }

    /**
     * Filter product by product ID
     * @param products 
     * @param productId 
     */
    getProductById(products: Product[], productId: number) {
        var products: Product[] = products.filter((product: Product) => product.Id === productId);
        // Return product
        return products.length ? products[0] : {};
    }


    /**
     * Merge Duplicate Items
     */
    mergeDuplicateItems(orders: Order[]) {
        // debugger
        var orders: Order[] = JSON.parse(JSON.stringify(orders));
        orders.forEach((order: Order) => {
            var counts = [];
            order.OrderItems.forEach((a, i) => {
                if (counts[a.ItemId] === undefined) {
                    counts[a.ItemId] = a;
                } else {
                    counts[a.ItemId].Qty += a.Qty;
                }
            });
            order.OrderItems = counts;
            order.OrderItems = order.OrderItems.filter((n) => n != undefined);
        });

        return orders;
    }

    // Calculate sum of the items in a order list
    // -> Avoids void and gift items from calculation of total
    calculateSum(): number {
        let totalAmount = 0;
        if (this.parsedOrders.length) {
            this.parsedOrders.forEach((order) => {
                order.OrderItems.forEach(item => {
                    totalAmount += item.TotalAmount;
                });
                // totalAmount = totalAmount +
                //     (order.OrderItems.length) ? order.OrderItems.reduce((total: number, order: OrderItem) => {
                //         return total + order.Qty * order.UnitPrice / 1.13;
                //     }, 0) : 0;
            });
        }

        return eval(totalAmount.toFixed(2));
    }

    // Calculates Discount
    calculateDiscount() {
        return 0.00;
        // let sum = this.calculateSum();
        // let giftSum = this.calculateVoidGiftSum();
        // let value = (giftSum / sum) * 100 || 0;

        // return (this.ticket.Discount)
        //     ? this.ticket.Discount.toFixed(2)
        //     : (sum * (value / 100)).toFixed(2);
    }

    /**
     * Calculates void and gift sum
     */
    calculateVoidGiftSum(): number {
        let totalSum = 0;
        if (this.parsedOrders.length) {
            this.parsedOrders.forEach((order) => {
                var finalTotal = (order.OrderItems.length) ? order.OrderItems.forEach((order: OrderItem) => {
                    if (order.IsVoid || (order.Tags && order.Tags.indexOf('Gift')) != -1) {
                        totalSum = totalSum + order.Qty * eval((order.UnitPrice / 1.13).toFixed(2));
                    }
                }) : 0;
            });
        }

        return eval(totalSum.toFixed(2));
    }
    // Calculates Taxable Amount
    calculateTaxableAmount(): number {
        // let sum = this.calculateSum();
        // let Discount = this.ticket.Discount;
        // let TaxableAmount = sum - Discount;
        // return TaxableAmount; 
        return 0;
    }

    // Calculates VAT Amount
    calculateVat() {
        let taxableAmount = this.calculateSum();
        // let taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount * 0.13).toFixed(2);
    }

    /**
     * Calculates the grand total of the ticket
     */
    getGrandTotal() {
        let taxableAmount = this.calculateSum();
        // let taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount + taxableAmount * 0.13).toFixed(2);
    }

    /**
     * Calculates the Total Service Charge
     */
    calculateServiceCharge() {
        //let totalSum = this.calculateSum();
        //let discountAmount = this.calculateDiscount();
        //let ticketTotalAfterDiscount = totalSum - eval(discountAmount);

        //return (ticketTotalAfterDiscount * 0.1).toFixed(2);
        let servicecharge = 0;
        return servicecharge.toFixed(2);
    }

    // Go back to last page
    close() {
        this._location.back();
    }
    /**
     * Calculates the final balace of the ticket 
     */
    getFinalBalance(): number {
        let finalBalance = 0;
        const balanceCalc = eval(this.getGrandTotal()) - this.getTotalCharged(this.ticket);

        if (balanceCalc < 0) {
            finalBalance = balanceCalc * (-1);
        } else {
            finalBalance = balanceCalc;
        }

        return finalBalance;
    } 
    /**
     * Calculates total charged amount
     * @param ticket 
     */
    getTotalCharged(ticket: Ticket) {
        return ticket.PaymentHistory.reduce((total: number, pay: PaymentHistory) => {
            total = total + pay.AmountPaid;
            return total;
        }, 0);
    }

    //Transfer Bill
    TransferBill(ticket: Ticket, currentaccount: Account) {
        var r = confirm("Are you sure you want to continue?");
        if (r == false) {
            return false;
        }
        // debugger
        //alert("Ticket Id" + ticket.Id);
        //alert("Account Id" + currentaccount.Id);

        this._purchaseService.get(Global.BASE_POSBILLING_API_ENDPOINT + '?TicketId=' + ticket.Id + '&AccountId=' + currentaccount.Id).subscribe(
            data => {
                // debugger
                if (data == 1) //Success
                {
                    alert("Completed Success Transfer to Customer A/C!");
                    this._location.back();
                }
                else {
                    alert("There is some issue in saving records, please contact to system administrator!");
                }
            },

        );


    }
    LoadCustomers() {
        this._purchaseService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT&AccountGeneral=AG&CustomerId=CI')
            .subscribe(
                customers => {
                    this.account = customers;
                },
                // error => console.log(error)
            );
    }
/**
 * Gets individual journal voucher
 * @param Id 
 */
    getPrintInvoice(Id: string, AmountWord: number) {
        return this._purchaseService.get(Global.BASE_ORDERINVOICEPRINT_ENDPOINT + '?TicketNo=' + Id + '&InvoiceAmount=' + AmountWord);
    }
/**
 * Event Account
 * @param Id 
 */
    searchChangeAccountId($event) {
        console.log($event);
    }
    
}