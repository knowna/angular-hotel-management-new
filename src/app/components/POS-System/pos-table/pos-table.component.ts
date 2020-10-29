
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

// Model
import { Table } from '../../../Model/table.model';
import { Customer } from '../../../Model/customer.model';
import { Order, OrderItemRequest, OrderItem } from '../../../Model/order.model';
import { Product } from '../../../Model/product.model';
// import { Category } from '../../../Model/Category.model';
import { Ticket, PaymentHistory } from '../../../Model/ticket.model';

// Selectors
import * as ProductSelector from '../../../selectors/product.selector';
import * as CategorySelector from '../../../selectors/category.selector';
import * as CustomerSelector from '../../../selectors/customer.selector';
import * as TableSelector from '../../../selectors/table.selector';
import * as TicketSelector from '../../../selectors/ticket.selector';
import * as OrderSelector from '../../../selectors/order.selector';

// Services
import { TicketStoreService } from '../../../Service/store/ticket.store.service';
import { OrderStoreService } from '../../../Service/store/order.store.service';
import { OrderService } from '../../../Service/Billing/order.service';
import { Category } from 'src/app/Model/category.model';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Global } from 'src/app/Shared/global';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { subscribeOn } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-pos-table',
    templateUrl: './pos-table.component.html',
    styleUrls: ['./pos-table.component.css']
})
export class PosTableComponent implements OnInit {

    public postableForm: FormGroup;

  

    config = {
        search:true,
        displayKey:"Name",
        searchOnKey: 'Name',
        height: '300px'
    }

    categories$: Observable<Category[]>
    products$: Observable<Product[]>;
    ticket$: Observable<Ticket>;
    ticketsLoading$: Observable<any>;    
    orders$: Observable<Order[]>;
    ordersLoading$: Observable<any>;
    table$: Observable<Table>;
    customer$: Observable<any>;

    isLoading: boolean = false;
    isTicketEmpty: boolean = false;      
    table: Table;
    parsedOrders: Order[] = [];
    ticketNote: string;
    enableTicketNote: boolean = false;
    customer: Customer;
    selectedCategory: number = 0;
    previousItem: OrderItem;
    selectedItem: OrderItem;
    selectedCustomerId: number;
    selectedTable: string;
    selectedTicket: number;
    toOpenTicketId: number = 0;
    qtyFromCalculator: string = '1';
    currentUser: any;
    currentYear: any;
    ticket: Ticket = {
        TotalAmount: 0,
        Discount: 0
    };
    SearchProduct = "";
    SearchCategory = "";

    productList=[];
    productNameList=[];

    tableListNew = [];
    tableNew: Table;
    ordersNew : Order[] = [];

    tables$: Observable<Table[]>
    dummyTable : Table = {"Id":1,"TableId":"1","Name":"101","Description":null,"OrderOpeningTime":"2020-10-26T02:51:50.3495623-07:00","TicketOpeningTime":"2020-10-26T02:51:50.3495623-07:00","LastOrderTime":"2020-10-26T02:51:50.3495623-07:00","TableStatus":"true"};

    // Constructor
    constructor(
        private store: Store<any>,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private ticketStoreApi: TicketStoreService,
        private orderApi: OrderService,        
        private orderStoreApi: OrderStoreService,
        private fb: FormBuilder, 
        private billService: BillingService,
        private toastrService: ToastrService

    ) {
       

        // Initialiazation;
        this.selectedTicket = 0;
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('userInformation'));

        // Actual work logic
        this.activatedRoute.params.subscribe(params => {
            this.selectedTable = (params['tableId']) ? params['tableId'] : '';
            
            this.selectedTicket = (params['ticketId']) ? params['ticketId'] : 0;
            if(this.selectedTicket){
                this.orderApi.loadOrdersNew(this.selectedTicket.toString())
                    .subscribe(
                        data => {
                            this.ordersNew = data;
                            // this.ordersNew.forEach((order: Order) => {
                            //     order.OrderItems.forEach((item: any) => {
                            //         item.Tags = item.Tags.split(',');
                            //     });
                            // });
                            // console.log('the new', this.ordersNew)
                        }
                    )
            }

            this.selectedCustomerId = (params['customerId']) ? params['customerId'] : 0;
            
            if (this.router.url.indexOf('move') !== -1) {
                this.toOpenTicketId = (params['ToOpenTicketId']) ? params['ToOpenTicketId'] : 0;
            }
            if ((this.selectedTicket || this.toOpenTicketId) || this.selectedCustomerId) {
                this.ticketStoreApi.setCurrentTicket(this.selectedTicket || this.toOpenTicketId);
                this.orderStoreApi.loadOrdersByTicket(this.selectedTicket || this.toOpenTicketId);
            } else {
                this.ticketStoreApi.clearAllTickets();
            }
        });

        this.billService.loadTables()
            .subscribe(data => {
                this.tableListNew = data;
                if(this.tableListNew != null) {
                    this.tableNew = this.tableListNew.find(t => t.TableId == this.selectedTable);
                }
        });

        
        
        
    }

    // Initialize data here
    ngOnInit() {


        this.buildForm();
        this.loadProducts();
        // Init Required data
        this.products$ = this.store.select(ProductSelector.getAllProducts);
        
        
        this.categories$ = this.store.select(CategorySelector.getAllCategories);
        // console.log('the categories', this.products$)
        this.ticketsLoading$ = this.store.select(TicketSelector.getLoadingStatus);        
        this.ticket$ = this.store.select(TicketSelector.getCurrentTicket);
        // console.log('ticket in table is', this.ticket$);
        this.customer$ = this.store.select(CustomerSelector.getCurrentCustomerId);
        this.orders$ = this.store.select(OrderSelector.getAllOrders);   
       
        this.ordersLoading$ = this.store.select(OrderSelector.getLoadingStatus);
        
        if (this.selectedTicket) {
            this.orders$ = this.store.select(OrderSelector.getAllOrders);
            this.orders$.subscribe((orders: Order[]) => {
                this.parsedOrders = orders;
            });
        }

        // console.log('the orders are', this.orders$)

        this.table$ = this.store.select(TableSelector.getCurrentTable);
        // console.log('the current table is', this.table$)
        this.customer$.subscribe((customerId: any) => {
            this.customer = customerId;
            this.selectedCustomerId = customerId ? customerId : 0;
        });

        // this.table$.subscribe((table: Table) => {
        //     this.selectedTable = table.TableId || '';
        //     this.table = table;
        //     console.log('the table is', this.table)
        // });
        

        this.ticket$.subscribe((ticket: Ticket) => {
            this.isLoading = false;
            if (ticket) {
                this.selectedTicket = ticket.Id || 0;
                this.ticket = ticket;
                this.ticketNote = ticket.Note;
            }
        });

        this.ticketsLoading$.subscribe((isLoading: boolean) => {
            this.isLoading = isLoading;
        });

        this.ordersLoading$.subscribe((isLoading: boolean) => {
            this.isLoading = isLoading;
        });


        
    }

    buildForm(){
        this.postableForm = this.fb.group({
            AccountTransactionValues: this.fb.array([this.buildMenuForm()]),
        });
    }

    buildMenuForm() {
        //initialize our vouchers
        return this.fb.group({
            productId: ['',Validators.required],
            quantity: [1,Validators.required],
            description: ['',Validators.required]
        });
    }


    addCategory(){
        // let product = this.postableForm.value.AccountTransactionValues[index].productId;
        // product.Qty = this.postableForm.value.AccountTransactionValues[index].quantity;
        // console.log('the product is', product)
        // console.log('the index of current added data is', index);
        // this.addOrderItem(product);
        // console.log(this.postableForm.value.AccountTransactionValues);
       
        
        
        this.AccountTransactionValues.push(this.buildMenuForm());
        
    }


    loadProducts(): void {
        let prodName;
        let list=[];
        this.billService.loadProducts()
            .subscribe(data => { 
                this.productList=data;
                // console.log('the products are', this.productList);
                
                
                data.forEach(prod => {
                    prodName = prod.Name;
                   list.push(prodName)
                });
                
                this.productNameList =list;
                
        });
    }

    loadTables(selectedTable): void {
        this.billService.loadTables()
            .subscribe(data => {
                this.tableListNew = data;
                if(this.tableListNew != null) {
                    // console.log('the table list are', this.tableListNew)
                    this.tableNew = this.tableListNew.find(t => t.TableId === selectedTable);
                    // console.log('the data of table is', this.tableNew)
                }
               
            })
    }


    selectionChanged(event,i){
        // this.postableForm.value.AccountTransactionValues[i].productId = event.value.Id;
        // this.postableForm.controls['AccountTransactionValues'].setValue(this.postableForm.value.AccountTransactionValues)
        // this.addOrderItem(event.value);
        // this.postableForm.controls['productId'].setValue(event.value.Id);

        // this.productList.find(prod=>{
        //     prod.Name ===event.value;
        //     // console.log(prod.Name);
            
        //     if(prod){
        // // console.log(prod.ItemId);
        //     }
            
        // })
        
    }




    removeTrackerModel(index){
        this.AccountTransactionValues.removeAt(index);
    }

    get AccountTransactionValues(): FormArray {
        return this.postableForm.get('AccountTransactionValues') as FormArray;
    }






    /**
     * Makes changes in state on clicking the back button
     */
    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        let currentUrl = this.router.url;
        let tableIndex = currentUrl.indexOf('table');
        let ticketIndex = currentUrl.indexOf('ticket');

        if (tableIndex !== -1 && ticketIndex !== -1) {
            this.ticketStoreApi.setCurrentTicket(null);
            this.ticketStoreApi.clearAllTickets();
        }
    }

    // Select/Deselect Order Item
    selectOrderItem(OrderItem: OrderItem) {
        this.previousItem && this.orderStoreApi.unSelectOrderItem(this.previousItem);

        if (!OrderItem.IsSelected && this.previousItem !== OrderItem) {
            OrderItem.Current = true;
            this.selectedItem = OrderItem;
            this.orderStoreApi.selectOrderItem(OrderItem);
            this.previousItem = OrderItem;
        } else {
            OrderItem.Current = false;
            this.orderStoreApi.unSelectOrderItem(OrderItem);
            this.selectedItem = this.previousItem = undefined;

        }
    }

	/**
	 * Makes the selected item Void
	 * -> means the Order item has no value
	 * @param OrderItem 
	 */
    voidItem(OrderItem: OrderItem) {
        let submittedIndex = OrderItem.Tags.indexOf('Submitted');

        if (submittedIndex !== -1 && OrderItem.IsVoid) {
            OrderItem.IsVoid = false;
            OrderItem.TotalAmount = OrderItem.Qty * OrderItem.UnitPrice / 1.13; //Add Function VAT Value Minues;

            let requestObject: OrderItemRequest = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem);
            this.orderStoreApi.unVoidOrderitem(requestObject);
        }

        if (submittedIndex !== -1 && !OrderItem.IsVoid) {
            OrderItem.IsVoid = true;
            OrderItem.TotalAmount = 0;

            let requestObject: OrderItemRequest = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem);
            this.orderStoreApi.voidOrderitem(requestObject);
        }
    }

	/**
	 * Increments Order Item Quantity by one
	 * @param OrderItem 
	 */
    incrementQty(OrderItem: OrderItem) {
        let newOrderItem: any = '';        
        let orderItemParsed = JSON.parse(JSON.stringify(OrderItem));
        let parsedOrders = JSON.parse(JSON.stringify(this.parsedOrders));

        parsedOrders.map((order: Order) => {
            order.OrderItems.map((orderItem: OrderItem) => {
                if (orderItem.Id === orderItemParsed.Id) {
                    orderItem.Qty = orderItem.Qty + 1;
                    orderItem.TotalAmount = orderItem.Qty * orderItem.UnitPrice / 1.13; //Add Function VAT Value Minues;
                    newOrderItem = orderItem;
                }
            });
        });

        let requestObject: OrderItemRequest = this.prepareOrderItemRequest(orderItemParsed.OrderId, newOrderItem, parsedOrders, false, false, false, true);
        this.orderStoreApi.incrementQty(requestObject);
    }

	/**
	 * Decrements Order Item Quantity by one
	 * @param OrderItem 
	 */
    decrementQty(OrderItem: OrderItem) {
        let newOrderItem: any = '';        
        let orderItemParsed = JSON.parse(JSON.stringify(OrderItem));
        let parsedOrders = JSON.parse(JSON.stringify(this.parsedOrders));

        parsedOrders.map((order: Order) => {
            order.OrderItems.map((orderItem: OrderItem) => {
                if (orderItem.Id === orderItemParsed.Id) {
                    orderItem.Qty = orderItem.Qty - 1;
                    orderItem.TotalAmount = orderItem.Qty * orderItem.UnitPrice / 1.13; //Add Function VAT Value Minues;
                    newOrderItem = orderItem;
                }
            });
        });

        if (newOrderItem.Qty >= 1) {
            let requestObject: OrderItemRequest = this.prepareOrderItemRequest(orderItemParsed.OrderId, newOrderItem, parsedOrders, false, false, false, true);
            this.orderStoreApi.decrementQty(requestObject);
        }
    }

	/**
	 * Decrements Order Item Quantity by one
	 * @param OrderItem 
	 */
    toogleGiftItem(OrderItem: OrderItem) {
        let requestObject: OrderItemRequest = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem);
        this.orderStoreApi.toogleItemAsGift(requestObject);
    }

    /**
	 * Function for moving order/ order item form one ticket to other
	 * @param OrderItem
	 */
    moveItems(OrderItem: OrderItem) {
        let Orders = this.prepareOrders(OrderItem);
        let requestObjectWithoutMovedOrderItem: OrderItemRequest = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem, Orders.ordersWithoutSelectedOrderItem, true);
        let requestObjectForMovedOrderItem: OrderItemRequest = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem, Orders.ordersWithOnlySelectedItem, true, false, false, false, true);
        
        if (requestObjectWithoutMovedOrderItem !== null && requestObjectForMovedOrderItem !== null) {
            let moveAction = this.orderApi.moveOrderItems({
                'requestObjectWithoutMovedOrderItem': requestObjectWithoutMovedOrderItem,
                'requestObjectForMovedOrderItem': requestObjectForMovedOrderItem
            });
    
            moveAction.subscribe((moveResponse) => {
                moveResponse && this.redirectAfterItemMove(moveResponse);
            });
        }
    }

    /**
     * Redirects to specific route after an order item is moved
     * @param moveResponse 
     */
    redirectAfterItemMove (moveResponse: any) {
        moveResponse.TableId !== '0' && this.router.navigate(['/table/' + moveResponse.TableId + '/move/' + moveResponse.Ticket.Id]);
        moveResponse.CustomerId !== 0 && this.router.navigate(['/customer/' + moveResponse.CustomerId + '/move/' + moveResponse.TicketId]);
    }

    // Update product quantity
    updateQty(ItemQuantity: string) {
        this.qtyFromCalculator = ItemQuantity;
    }

    // Add Product in orders function

    
    // addOrderItem(product: Product) {
        
    //     let UnSubmittedOrder = this.getUnSubmittedOrder(this.parsedOrders);
    //     let TempQty = this.qtyFromCalculator ? eval(this.qtyFromCalculator) : 1;
    //     let ProductTotal = eval((TempQty * product.UnitPrice / 1.13).toFixed(2)); //Add Function VAT Value Minues;
    //     let unitprice = product.UnitPrice;
    //     let VatPercent = 0.13;       
    //     let OrderItem = {
    //         "UserId": this.currentUser.UserName,
    //         "FinancialYear": this.currentYear.Name,
    //         "OrderId": 0,
    //         "ItemId": product.Id,
    //         "Qty": TempQty,
    //         "UnitPrice": unitprice,
    //         "TotalAmount": ProductTotal,
    //         "Tags": "New Order",
    //         "IsSelected": false,
    //         "IsVoid": false
    //     };
    //     this.orderStoreApi.addOrderItem(this.prepareOrderItemRequest(UnSubmittedOrder ? UnSubmittedOrder.OrderNumber : 0, OrderItem, this.parsedOrders, false, true, true));
    //     this.updateQty('1');
    // }

    createOrder(){
        let list= this.postableForm.value.AccountTransactionValues;
        // console.log(list);

        let ListOrderItem =[];

        list.forEach(orderReq => {
            ListOrderItem.push (orderReq.productId);
           
        });
        this.addOrderItemList(ListOrderItem);

        
    }

    addOrderItemList(products: Product[]) {
       let  ListOrderItem=[];
        let UnSubmittedOrder = this.getUnSubmittedOrder(this.parsedOrders);

        products.forEach(product => {
        let TempQty = this.qtyFromCalculator ? eval(this.qtyFromCalculator) : 1;
        let ProductTotal = eval((TempQty * product.UnitPrice / 1.13).toFixed(2)); //Add Function VAT Value Minues;
        let unitprice = product.UnitPrice;
        let VatPercent = 0.13;       
        let OrderItem = {
            "Id":0,
            "UserId": this.currentUser.UserName,
            "FinancialYear": this.currentYear.Name,
            "OrderNumber":0,
            "OrderDescription":'abcxd',
            "OrderId": 0,
            "ItemId": product.Id,
            "Qty": TempQty,
            "UnitPrice": unitprice,
            "TotalAmount": ProductTotal,
            "Tags": "New Order",
            "IsSelected": false,
            "IsVoid": false
        };
        ListOrderItem.push(OrderItem);
    });

    let orderRequest={
       
        "TicketId":this.selectedTicket?this.selectedTicket:0,
        "TableId":this.selectedTable?this.selectedTable:0,
        "CustomerId":this.selectedCustomerId?this.selectedCustomerId:0,
        "OrderId":0,
        "TicketTotal":100,
        "Discount":0,
        "ServiceCharge":0,
        "VatAmount":0,
        "GrandTotal":100,
        "Balance":0,
        "UserId":this.currentUser.UserName,
        "FinancialYear":this.currentYear.Name,
        "ListOrderItem":ListOrderItem


    }


    this.orderApi.addOrderProductList(orderRequest).subscribe(
        data =>{
          this.toastrService.success('oder successfully created')
            
        }
    )
    
        // this.orderStoreApi.addOrderItem(this.prepareOrderItemRequest(UnSubmittedOrder ? UnSubmittedOrder.OrderNumber : 0, ListOrderItem, this.parsedOrders, false, true, true));
        // this.updateQty('1');
    }


    // Filter and get unsubmitted order
    getUnSubmittedOrder(orders: Order[]) {
        if (orders) {
            return orders.filter((order) => {
                return order.OrderStatus === "New Order";
            })[0];
        }
    }

	/**
	 * Remove Order Item for given order
	 * @param OrderItem 
	 */
    removeItem(OrderItem: OrderItem) {
        let Orders = this.prepareOrders(OrderItem);
        let requestObjectWithoutMovedOrderItem: OrderItemRequest = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem, Orders.ordersWithoutSelectedOrderItem, true);
        let ItemsOrder: Order[] = Orders.ordersWithoutSelectedOrderItem.filter(order => order.OrderNumber == OrderItem.OrderNumber);
        let UnSubmittedOrder = this.getUnSubmittedOrder(ItemsOrder);

        if (UnSubmittedOrder) {
            return this.orderStoreApi.deleteOrderItem(requestObjectWithoutMovedOrderItem);
        }
    }

    /**
     * Prepare the request object for Moving and Deleting the Order Item
     * @param OrderItem {Object} Selected Order Item in the orders
     * 
     * @return {Object} Object Containing different Orders list
     */
    prepareOrders(OrderItem: OrderItem): any {
        let Order: Order;
        let ClonedOrder: Order;
        let OrderItemsLength: number;
        let ItemIndexInOrders: number;
        let OrdersWithMovedItem: Order[];
        let OrdersWithoutMovedItem: Order[];

        OrdersWithoutMovedItem = JSON.parse(JSON.stringify(this.parsedOrders));
        Order = OrdersWithoutMovedItem.filter((order) => {
            return order.OrderNumber == OrderItem.OrderNumber;
        })[0];

        OrderItemsLength = Order && Order.OrderItems.length;
        OrderItemsLength === 1 &&  delete Order.OrderItems[0];

        if (OrderItemsLength > 1) {
            for (let i = 0; i < Order.OrderItems.length; i++) {
                if (Order.OrderItems[i].OrderId === OrderItem.OrderId) {
                    ItemIndexInOrders = i;
                    break;
                }
            }
            ItemIndexInOrders !== -1 &&  Order.OrderItems.splice(ItemIndexInOrders, 1);
        }

        if (Order) {
            ClonedOrder = JSON.parse(JSON.stringify(Order));
            delete ClonedOrder['OrderItems'];
            ClonedOrder.OrderItems = [OrderItem];
        }

        return {
            'ordersWithoutSelectedOrderItem': OrdersWithoutMovedItem,
            'ordersWithOnlySelectedItem': [ClonedOrder],
        };
    }

	/**
	 * Checks if the given ticket is submitted or not
	 * @param ticket 
	 */
    isTicketSubmitted(ticket: Ticket) {
        return ticket.isSubmitted === true;
    }

	/**
	 * Loads all tickets under given table Id
	 * @param tableId 
	 */
    getTableTickets(tableId: string) {
        this.ticketStoreApi.loadTicketsByTable(tableId);
    }

	/**
	 * Gets Orders for given Ticket
	 * @param ticket
	 */
    getTicketOrders(ticket: Ticket) {
        this.orderStoreApi.loadOrdersByTicket(ticket.Id);
    }

	/**
	 * Calls API to lock the given ticket
	 */
    printBill() {
        this.ticketStoreApi.printBill(this.ticket.Id);
    }

	/**
	 * Saves the ticket note in the database
	 * @param ticket 
	 */
    saveTicketNote(ticket: number) {
        ticket && this.ticketStoreApi.addTicketNote(ticket, this.ticketNote);
        this.enableTicketNote = false;
    }

	/**
	 * Enable/ Disable the ticket note field
	 */
    showTicketNote() {
        this.enableTicketNote = !this.enableTicketNote;
    }

	/**
	 * Calls the API to create an new ticket on the current table
	 */
    createNewTicket() {
        if (this.selectedTable) {
            this.router.navigate(['pos/table/' + this.selectedTable + '/empty-ticket']);
        }

        if (this.selectedCustomerId) {
            this.ticketStoreApi.clearAllTickets();
            this.router.navigate(['pos/customer/' + this.selectedCustomerId + '/empty-ticket']);
        }
    }

    // Calculate sum of the items in a order list
    // -> Avoids void and gift items from calculation of total
    calculateSum(orders = []): number {
        let totalAmount = 0;
        
        orders = (orders !== undefined) ? orders : this.parsedOrders;

        if (orders.length) {
            orders.forEach((order) => {
                totalAmount = totalAmount +
                    (order.OrderItems.length) ? order.OrderItems.reduce((total: number, order: OrderItem) => {
                        return total + order.Qty * order.UnitPrice/1.13;
                    }, 0) : 0;
            });
        }

        return eval(totalAmount.toFixed(2));
    }

    // Calculates Discount
    calculateDiscount() {
        return (this.calculateVoidGiftSum() + this.ticket.Discount).toFixed(2);
    }

    /**
     * Calculates the total amount of the payent history
     */
    getTotalCharged(ticket: Ticket) {
        if (!ticket) {
            return 0;
        }

        if (ticket.PaymentHistory) {
            return ticket.PaymentHistory.reduce((total: number, pay: PaymentHistory) => {
                total = total + pay.AmountPaid;
                return total;
            }, 0);
        } else {
            return 0;
        }
    }

    /**
    * Get the total balalce of the ticket
    * @param ticket 
    */
    getTicketTotalAmount(orders: Order[]) {
        return (orders.length)
            ? this.calculateTicketOrdersSum(orders)
            : 0;
    }

    /**
     * Prepares the order item request object
     * 
     * @param orderId 
     * @param selectedOrderItem 
     */
    prepareOrderItemRequest(orderId: number, selectedOrderItem: OrderItem, parsedOrders: Order[] = this.parsedOrders, isMove: boolean = false, isAdd: boolean = false, isNew: boolean = false, isIncDec: boolean = false, flag: boolean = false) {
        
        let ticketTotal = 0;
        let serviceCharge = 0;
        let tTotal = this.calculateSum(parsedOrders);
        let cServiceCharge = this.calculateServiceCharge();
        let discountAmount = this.calculateDiscount();
        let ProductTotal = selectedOrderItem.Qty * selectedOrderItem.UnitPrice/1.13; //Add Function VAT Value Minues;

        if (isMove) {
            ticketTotal = (this.ticket.TotalAmount) ? tTotal : tTotal + ProductTotal;
            if (flag === false && eval(discountAmount) > ticketTotal) {
                alert("Discount amount can't be greater than the ticket amount. So, the item can't be moved!");
                return null;
            }
            //serviceCharge = ticketTotal * 0.1;
        } else {
            ticketTotal = (this.ticket.TotalAmount)
                ? (isIncDec)
                    ? tTotal
                    : tTotal + ProductTotal 
                : ProductTotal;
            //serviceCharge = (ticketTotal - eval(discountAmount)) * 0.1;
        }

        let DiscountedAmount = (flag) ? ticketTotal : ticketTotal - eval(discountAmount);
        let VatPercent = 0.13;
        let Order = this.selectOrderByOrderId(selectedOrderItem.OrderNumber);

        let OrderObject = {
            UserId : this.currentUser.UserName,
            FinancialYear: this.currentYear.Name,
            TicketId: 0,
            TableId: '',
            CustomerId: 0,
            OrderId: 0,
            OrderItem: selectedOrderItem,
            TicketTotal: eval(ticketTotal.toFixed(2)),
            ServiceCharge: serviceCharge,
            Discount: flag ? 0 : eval(discountAmount) || 0,
            VatAmount: eval(((DiscountedAmount +  serviceCharge) * VatPercent).toFixed(2)),
            GrandTotal: eval((DiscountedAmount + serviceCharge + (DiscountedAmount + serviceCharge) * VatPercent).toFixed(2)),
            Balance: eval((DiscountedAmount + serviceCharge + (DiscountedAmount + serviceCharge) * VatPercent - this.getTotalCharged(this.ticket)).toFixed(2))
        };

        OrderObject.OrderItem['UserId'] = this.currentUser.UserName;
        OrderObject.OrderItem['FinancialYear'] = this.currentYear.Name;
        OrderObject.OrderId = this.prepareOrderId(isMove, isAdd, Order, orderId);
        OrderObject.TicketId = this.selectedTicket || 0;
        OrderObject.TableId = this.selectedTable || '0';
        OrderObject.CustomerId = this.selectedCustomerId || 0;



        return OrderObject;
    }

    // prepareOrderItemRequestList(orderId: number, selectedOrderItem: OrderItem[], parsedOrders: Order[] = this.parsedOrders, isMove: boolean = false, isAdd: boolean = false, isNew: boolean = false, isIncDec: boolean = false, flag: boolean = false) {
        
    //     let ticketTotal = 0;
    //     let serviceCharge = 0;
    //     let tTotal = this.calculateSum(parsedOrders);
    //     let cServiceCharge = this.calculateServiceCharge();
    //     let discountAmount = this.calculateDiscount();
    //     let ProductTotal = selectedOrderItem.Qty * selectedOrderItem.UnitPrice/1.13; //Add Function VAT Value Minues;

    //     if (isMove) {
    //         ticketTotal = (this.ticket.TotalAmount) ? tTotal : tTotal + ProductTotal;
    //         if (flag === false && eval(discountAmount) > ticketTotal) {
    //             alert("Discount amount can't be greater than the ticket amount. So, the item can't be moved!");
    //             return null;
    //         }
    //         //serviceCharge = ticketTotal * 0.1;
    //     } else {
    //         ticketTotal = (this.ticket.TotalAmount)
    //             ? (isIncDec)
    //                 ? tTotal
    //                 : tTotal + ProductTotal 
    //             : ProductTotal;
    //         //serviceCharge = (ticketTotal - eval(discountAmount)) * 0.1;
    //     }

    //     let DiscountedAmount = (flag) ? ticketTotal : ticketTotal - eval(discountAmount);
    //     let VatPercent = 0.13;
    //     let Order = this.selectOrderByOrderId(selectedOrderItem.OrderNumber);

    //     let OrderObject = {
    //         UserId : this.currentUser.UserName,
    //         FinancialYear: this.currentYear.Name,
    //         TicketId: 0,
    //         TableId: '',
    //         CustomerId: 0,
    //         OrderId: 0,
    //         OrderItem: selectedOrderItem,
    //         TicketTotal: eval(ticketTotal.toFixed(2)),
    //         ServiceCharge: serviceCharge,
    //         Discount: flag ? 0 : eval(discountAmount) || 0,
    //         VatAmount: eval(((DiscountedAmount +  serviceCharge) * VatPercent).toFixed(2)),
    //         GrandTotal: eval((DiscountedAmount + serviceCharge + (DiscountedAmount + serviceCharge) * VatPercent).toFixed(2)),
    //         Balance: eval((DiscountedAmount + serviceCharge + (DiscountedAmount + serviceCharge) * VatPercent - this.getTotalCharged(this.ticket)).toFixed(2))
    //     };

    //     OrderObject.OrderItem['UserId'] = this.currentUser.UserName;
    //     OrderObject.OrderItem['FinancialYear'] = this.currentYear.Name;
    //     OrderObject.OrderId = this.prepareOrderId(isMove, isAdd, Order, orderId);
    //     OrderObject.TicketId = this.selectedTicket || 0;
    //     OrderObject.TableId = this.selectedTable || '0';
    //     OrderObject.CustomerId = this.selectedCustomerId || 0;


    //     console.log('the added order item is', OrderObject);

    //     return OrderObject;
    // }




    /**
     * Prepares Order Id based on wether the order is in move or In add state
     */
    prepareOrderId (isMove, IsAdd, Order, OrderId) {
        let orderId: any = 0;

        if (isMove && Order.OrderItems.length === 1) {
            orderId = Order.Id;
        } 

        if (IsAdd) {
            orderId = OrderId;
        } 

        return orderId;
    }


    /**
     *  Select given Order by Id
     *  @param OrderId {number} Order Id
     */
    selectOrderByOrderId(OrderId: number): any {
        let parsedOrder = this.parsedOrders.length && this.parsedOrders.filter((order) => {
            return order.OrderNumber == OrderId;
        });

        return parsedOrder.length ? parsedOrder[0] : { orderItems: [] };
    }

    /**
     * Calculates Ticket Orders Sum
     */
    calculateTicketOrdersSum(orders: Order[]) {
        let totalAmount = 0;

        if (!orders.length) {
            return totalAmount;
        }

        orders.forEach((order) => {
            if (order.OrderItems.length) {
                let total: number = 0;
                order.OrderItems.forEach((orderItem) => {
                    
                    return (!orderItem.IsVoid && orderItem.Tags.indexOf('Gift') === -1)
                        ? total = total + orderItem.Qty * orderItem.UnitPrice
                        : total = total;
                });
                totalAmount = totalAmount + total;
            } else {
                totalAmount = totalAmount + 0;
            }
        });

        return totalAmount;
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
                        totalSum = totalSum + order.Qty * order.UnitPrice;
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

    /**
     * checks ticket
     */
    checkTicket(): boolean {
        return (!this.selectedTicket || this.toOpenTicketId) 
            ? true 
            : false;
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
}