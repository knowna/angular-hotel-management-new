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
import { ToastrService } from 'ngx-toastr';
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';
import { Global } from 'src/app/Shared/global';

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

    customerNew: Customer;

    selected: any = '';
    isSelected: boolean = false;
    voidGiftSum: number = 0;
    
    selectedTicket: number;

    permissionList : string;

    company:any;

    // Constructor
    constructor(
        private store: Store<any>,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userStoreService: UserStoreService,
        private _location: Location,
        private ticketService: TicketService,
        private billService:BillingService,
        private toastrService: ToastrService,
        private _customerService:AccountTransactionTypeService,

    ) {}

    // On component Init
    ngOnInit() {
        this.company = JSON.parse(localStorage.getItem("company"));

        console.log('the orders in pos orders are', this.orders);
        console.log('the customer us', this.selectedCustomerId)
        console.log('the table us', this.table)

        this.permissionList = localStorage.getItem('permissionList');
        console.log('the permission list in settle page is', this.permissionList);


        this.activatedRoute.params.subscribe(params => {
            this.selectedTicket = (params['ticketId']) ? params['ticketId'] : 0;
            this.selectedCustomerId = (params['customerId']) ? params['customerId'] : 0;
            console.log('after route cus id', this.selectedCustomerId);
            console.log('the selected ticket id in pos order is', this.selectedTicket);
            if(this.selectedTicket) {
                this.ticketService.getTicketById(this.selectedTicket)
                    .subscribe(
                        data => {
                            this.ticket = data;
                        }
                );
            }
        });

        this.user$ = this.userStoreService.user$;
        this.customer$ = this.store.select(CustomerSelector.getCurrentCustomer);

        this._customerService.get(Global.BASE_ACCOUNT_POSCUSTOMER_ENDPOINT)
            .subscribe(
            customers => {
                this.customerNew = customers.find(c => c.Id == this.selectedCustomerId);
            },
            error => console.log(error)
        );
        console.log('the ticket is', this.ticket)
       
    }

    changeSelected(OrderItems,currentIndex) {
        OrderItems = OrderItems.map(function(x) {
            const i = OrderItems.indexOf(x);
            if(i == currentIndex) {
                x.IsSelected = !x.IsSelected;
            }else{
                x.IsSelected = false;
            }   
            return x;
        });
    }
        




    // Calculates Discount
    calculateDiscount() {
        let discount = this.ticket.Discount;

        this.orders.forEach(order => {
            order.OrderItems.forEach(item => {
                // console.log('the item in discount is', item)
                if(item.Tags === 'Void'){
                    discount += item.TotalAmount;
                }
            });
        });

        return discount.toFixed(2);
        
    //     let sum = this.calculateSum();
    //     let giftSum = this.calculateVoidGiftSum();
    //     let value = (giftSum / sum) * 100 || 0;

    //    return (this.ticket.Discount)
    //         ? this.ticket.Discount.toFixed(2)
    //         : (sum * (value / 100)).toFixed(2);
            
    }
	/**
	 * Item Price
	 * @param UnitPrice 
	 */
    CurrentUnitPrice(UnitPrice: number) {
        // let currentprice = UnitPrice / 1.13;
        // Return product
        // return currentprice.toFixed(2);
        return UnitPrice.toFixed(2);
    }
	/**
	 * Item Price
	 * @param UnitPrice 
	 * @param Qty 
	 */
    ProductPrice(UnitPrice: number, Qty: number) {
        // let currentprice = UnitPrice / 1.13 * Qty; 
        // Return product
        // return currentprice.toFixed(2);
        return (UnitPrice * Qty).toFixed(2);
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
                order.OrderItems.forEach(item => {
                    totalAmount += item.TotalAmount;
                });
                // totalAmount = totalAmount +
                //     (order.OrderItems.length) ? order.OrderItems.reduce((total: number, order: OrderItem) => {
                //         return total + order.Qty * order.UnitPrice/1.13;
                //     }, 0) : 0;

            });
        }

        return eval(totalAmount.toFixed(2));
    }

    /**
     * Calculates the Total Service Charge
     */
    calculateServiceCharge() {
        let totalSum = this.calculateSum();
        let discountAmount = this.calculateDiscount();
        let ticketTotalAfterDiscount = totalSum - eval(discountAmount);
        return (ticketTotalAfterDiscount * this.company?.ServiceCharge/100).toFixed(2);
        // return (0).toFixed(2);
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


    settle() {
        // console.log('the table is', this.selectedTable);
        // console.log('the customer is', this.selectedCustomerId);
        if(this.selectedTable) {
            this.router.navigate(['/pos/settle'], { queryParams: { tableId: this.selectedTable , ticketId : this.selectedTicket} });
        }else {
            this.router.navigate(['/pos/settle'], { queryParams: { customerId: this.selectedCustomerId , ticketId : this.selectedTicket} });
        }
        
    }
}
