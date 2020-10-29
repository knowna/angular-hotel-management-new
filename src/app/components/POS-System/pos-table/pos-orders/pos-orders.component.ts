import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

// Third party libraries
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';

// Model
import { User } from '../../../../Model/user.model';
import { Customer } from '../../../../Model/customer.model';
import { Table } from '../../../../Model/table.model';
import { Product } from '../../../../Model/product.model';
import { Order, OrderItem } from '../../../../Model/order.model';
import { Ticket, PaymentHistory } from '../../../../Model/ticket.model';

// Selectors
import * as CustomerSelector from '../../../../selectors/customer.selector';

// Services
import { UserStoreService } from '../../../../Service/store/user.store.service';
import { TicketService } from 'src/app/Service/Billing/ticket.service';
import { BillingService } from 'src/app/Service/Billing/billing.service';

@Component({
  selector: 'pos-orders',
  templateUrl: './pos-orders.component.html',
  styleUrls: ['./pos-orders.component.css']
})
export class PosOrdersComponent implements OnInit {
    @Input('table') table: Table;
    @Input('ticket') ticket: Ticket;
    @Input('products') products: Product[];
    @Input('orders') orders: Order[];
    @Input('selectedTable') selectedTable: string;
    @Input('selectedCustomerId') selectedCustomerId: string;

    @Output() selectOrderItem: EventEmitter<any[]> = new EventEmitter<any[]>();

    user$: Observable<User>
    customer$: Observable<Customer>

    selected: any = '';
    isSelected: boolean = false;
    voidGiftSum: number = 0;
    
    selectedTicket: number;

    // Constructor
    constructor(
        private store: Store<any>,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userStoreService: UserStoreService,
        private _location: Location,
        private ticketService: TicketService,
        private billService:BillingService
    ) {}

    // On component Init
    ngOnInit() {
console.log('id of customer',this.selectedCustomerId);

        console.log('the orders are', this.orders);
        this.activatedRoute.params.subscribe(params => {
            this.selectedTicket = (params['ticketId']) ? params['ticketId'] : 0;
        });

        this.user$ = this.userStoreService.user$;
        this.customer$ = this.store.select(CustomerSelector.getCurrentCustomer);
        if(!this.ticket) {
            this.ticketService.loadTableTickets(this.table.TableId)
                .subscribe(
                    data => {
                        this.ticket = data.find(t => t.Id == this.selectedTicket);
                    }
                );
        }
    }




    // Calculates Discount
    calculateDiscount() {
        let sum = this.calculateSum();
        let giftSum = this.calculateVoidGiftSum();
        let value = (giftSum / sum) * 100 || 0;

       return (this.ticket.Discount)
            ? this.ticket.Discount.toFixed(2)
            : (sum * (value / 100)).toFixed(2);
    }
	/**
	 * Item Price
	 * @param UnitPrice 
	 */
    CurrentUnitPrice(UnitPrice: number) {
        let currentprice = UnitPrice / 1.13;
        // Return product
        return currentprice.toFixed(2);
    }
	/**
	 * Item Price
	 * @param UnitPrice 
	 * @param Qty 
	 */
    ProductPrice(UnitPrice: number, Qty: number) {
        let currentprice = UnitPrice / 1.13 * Qty; 
        // Return product
        return currentprice.toFixed(2);
    }
	/**
	 * Filter product by product ID
	 * @param products 
	 * @param productId 
	 */
    getProductById(products: Product[], productId: number) {
        var products: Product[] = this.products.filter((product: Product) => product.Id === productId);
        // Return product
        return products.length ? products[0] : {};
    }

	/**
	 *  Get the latest order time
	 * @param orders 
	 * @return Date
	 */
    getLastOrderTime(orders: Order[]) {
        let orderOpeningTimes: number[] = [];

        orders.map((order: Order) => {
            // Order opening time should be in number format
            orderOpeningTimes.push(new Date(order.OrderOpeningTime).getTime());
        });

        return moment(_.max(orderOpeningTimes)).format("DD/MM/YYYY hh:mm:ss A");
    }

    // Calculate sum of the items in a order list
    // -> Avoids void and gift items from calculation of total
    calculateSum(): number {
        let totalAmount = 0;

        if (this.orders.length) {
            this.orders.forEach((order) => {
                totalAmount = totalAmount +
                    (order.OrderItems.length) ? order.OrderItems.reduce((total: number, order: OrderItem) => {
                        return total + order.Qty * order.UnitPrice/1.13; //Add Function VAT Value Minues
                    }, 0) : 0;
            });
        }

        return eval(totalAmount.toFixed(2));
    }

    /**
     * Calculates the Total Service Charge
     */
    calculateServiceCharge() {
        //let totalSum = this.calculateSum();
        //let discountAmount = this.calculateDiscount();
        //let ticketTotalAfterDiscount = totalSum - eval(discountAmount);
        //return (ticketTotalAfterDiscount * 10/100).toFixed(2);
        return (0).toFixed(2);
    }

    // Calculates VAT amount
    calculateVat() {
        let taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount * 0.13).toFixed(2);
    }

    /**
     * Gets date
     */
    getDate(date: string) {
        return date ? moment(date).format("DD/MM/YYYY hh:mm:ss A") : '-';
    }

    /**
     * Gets payment time
     */
    getLastPaymentTime(ticket: Ticket) {
        return ticket && ticket.PaymentHistory.length && ticket.PaymentHistory[0].DateTime && this.getDate(ticket.PaymentHistory[0].DateTime);
    }

    /**
     * Gets total charged
     */
    getTotalCharged(ticket: Ticket) {
        return ticket && ticket.PaymentHistory.length && ticket.PaymentHistory.reduce((total: number, pay: PaymentHistory) => {
            total = total + pay.AmountPaid;
            return total;
        }, 0);
    }

    // Go back to last page
    close() {
        this.router.navigate(['/pos-dashboard/tables']);
    }

    /**
     * Calculates void and gift sum
     */
    calculateVoidGiftSum(): number {
        let totalSum = 0;

        if (this.orders.length) {
            this.orders.forEach((order) => {
                var finalTotal = (order.OrderItems.length) ? order.OrderItems.forEach((order: OrderItem) => {
                    if (order.IsVoid || (order.Tags && order.Tags.indexOf('Gift')) != -1) {
                        totalSum = totalSum + order.Qty * order.UnitPrice / 1.13; //Add Function VAT Value Minues;
                    }
                }) : 0;
            });
        }

        return eval(totalSum.toFixed(2));
    }

    /**
     * Calculates the grand total of the ticket
     */
    getGrandTotal() {
        let taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount + taxableAmount * 0.13).toFixed(2);
    }

    /**
     * Calculates the final balace of the ticket 
     */
    getFinalBalance() {
        return (eval(this.getGrandTotal()) - this.getTotalCharged(this.ticket)).toFixed(2)
    }   
}
