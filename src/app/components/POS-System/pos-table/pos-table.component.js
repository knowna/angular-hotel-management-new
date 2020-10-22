"use strict";
/* POS Table Component
*
* Author: Buddha Man Nepali <bmnepali980@gmail.com>
* Owner: Dcube IT Solutions Pvt. Ltd.
* UDate: 2017-10-114
* Version: 2.4.0
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// Selectors
var ProductSelector = require("../../selectors/product.selector");
var CategorySelector = require("../../selectors/category.selector");
var CustomerSelector = require("../../selectors/customer.selector");
var TableSelector = require("../../selectors/table.selector");
var TicketSelector = require("../../selectors/ticket.selector");
var OrderSelector = require("../../selectors/order.selector");
var PosTableComponent = /** @class */ (function () {
    // Constructor
    function PosTableComponent(store, router, activatedRoute, ticketStoreApi, orderApi, orderStoreApi) {
        var _this = this;
        this.store = store;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.ticketStoreApi = ticketStoreApi;
        this.orderApi = orderApi;
        this.orderStoreApi = orderStoreApi;
        this.isLoading = false;
        this.isTicketEmpty = false;
        this.parsedOrders = [];
        this.enableTicketNote = false;
        this.selectedCategory = 0;
        this.toOpenTicketId = 0;
        this.qtyFromCalculator = '1';
        this.ticket = {
            TotalAmount: 0,
            Discount: 0
        };
        this.SearchProduct = "";
        this.SearchCategory = "";
        // Initialiazation;
        this.selectedTicket = 0;
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // Actual work logic
        this.activatedRoute.params.subscribe(function (params) {
            _this.selectedTable = (params['tableId']) ? params['tableId'] : '';
            _this.selectedTicket = (params['ticketId']) ? params['ticketId'] : 0;
            _this.selectedCustomerId = (params['customerId']) ? params['customerId'] : 0;
            if (_this.router.url.indexOf('move') !== -1) {
                _this.toOpenTicketId = (params['ToOpenTicketId']) ? params['ToOpenTicketId'] : 0;
            }
            /**
             * Set current Ticket Id
             * Get current ticket's orders
             */
            if ((_this.selectedTicket || _this.toOpenTicketId) || _this.selectedCustomerId) {
                _this.ticketStoreApi.setCurrentTicket(_this.selectedTicket || _this.toOpenTicketId);
                _this.orderStoreApi.loadOrdersByTicket(_this.selectedTicket || _this.toOpenTicketId);
            }
            else {
                _this.ticketStoreApi.clearAllTickets();
            }
        });
    }
    // Initialize data here
    PosTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Init Required data
        this.products$ = this.store.select(ProductSelector.getAllProducts);
        this.categories$ = this.store.select(CategorySelector.getAllCategories);
        this.ticketsLoading$ = this.store.select(TicketSelector.getLoadingStatus);
        this.ticket$ = this.store.select(TicketSelector.getCurrentTicket);
        this.customer$ = this.store.select(CustomerSelector.getCurrentCustomerId);
        this.orders$ = this.store.select(OrderSelector.getAllOrders);
        this.ordersLoading$ = this.store.select(OrderSelector.getLoadingStatus);
        if (this.selectedTicket) {
            this.orders$.subscribe(function (orders) {
                _this.parsedOrders = orders;
            });
        }
        this.table$ = this.store.select(TableSelector.getCurrentTable);
        this.customer$.subscribe(function (customerId) {
            _this.customer = customerId;
            _this.selectedCustomerId = customerId ? customerId : 0;
        });
        this.table$.subscribe(function (table) {
            _this.selectedTable = table.TableId || '';
            _this.table = table;
        });
        this.ticket$.subscribe(function (ticket) {
            _this.isLoading = false;
            if (ticket) {
                _this.selectedTicket = ticket.Id || 0;
                _this.ticket = ticket;
                _this.ticketNote = ticket.Note;
            }
        });
        this.ticketsLoading$.subscribe(function (isLoading) {
            _this.isLoading = isLoading;
        });
        this.ordersLoading$.subscribe(function (isLoading) {
            _this.isLoading = isLoading;
        });
    };
    /**
     * Makes changes in state on clicking the back button
     */
    PosTableComponent.prototype.onPopState = function (event) {
        var currentUrl = this.router.url;
        var tableIndex = currentUrl.indexOf('table');
        var ticketIndex = currentUrl.indexOf('ticket');
        if (tableIndex !== -1 && ticketIndex !== -1) {
            this.ticketStoreApi.setCurrentTicket(null);
            this.ticketStoreApi.clearAllTickets();
        }
    };
    // Select/Deselect Order Item
    PosTableComponent.prototype.selectOrderItem = function (OrderItem) {
        this.previousItem && this.orderStoreApi.unSelectOrderItem(this.previousItem);
        if (!OrderItem.IsSelected && this.previousItem !== OrderItem) {
            OrderItem.Current = true;
            this.selectedItem = OrderItem;
            this.orderStoreApi.selectOrderItem(OrderItem);
            this.previousItem = OrderItem;
        }
        else {
            OrderItem.Current = false;
            this.orderStoreApi.unSelectOrderItem(OrderItem);
            this.selectedItem = this.previousItem = undefined;
        }
    };
    /**
     * Makes the selected item Void
     * -> means the Order item has no value
     * @param OrderItem
     */
    PosTableComponent.prototype.voidItem = function (OrderItem) {
        var submittedIndex = OrderItem.Tags.indexOf('Submitted');
        if (submittedIndex !== -1 && OrderItem.IsVoid) {
            OrderItem.IsVoid = false;
            OrderItem.TotalAmount = OrderItem.Qty * OrderItem.UnitPrice;
            var requestObject = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem);
            this.orderStoreApi.unVoidOrderitem(requestObject);
        }
        if (submittedIndex !== -1 && !OrderItem.IsVoid) {
            OrderItem.IsVoid = true;
            OrderItem.TotalAmount = 0;
            var requestObject = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem);
            this.orderStoreApi.voidOrderitem(requestObject);
        }
    };
    /**
     * Increments Order Item Quantity by one
     * @param OrderItem
     */
    PosTableComponent.prototype.incrementQty = function (OrderItem) {
        var newOrderItem = '';
        var orderItemParsed = JSON.parse(JSON.stringify(OrderItem));
        var parsedOrders = JSON.parse(JSON.stringify(this.parsedOrders));
        parsedOrders.map(function (order) {
            order.OrderItems.map(function (orderItem) {
                if (orderItem.Id === orderItemParsed.Id) {
                    orderItem.Qty = orderItem.Qty + 1;
                    orderItem.TotalAmount = orderItem.Qty * orderItem.UnitPrice;
                    newOrderItem = orderItem;
                }
            });
        });
        var requestObject = this.prepareOrderItemRequest(orderItemParsed.OrderId, newOrderItem, parsedOrders, false, false, false, true);
        this.orderStoreApi.incrementQty(requestObject);
    };
    /**
     * Decrements Order Item Quantity by one
     * @param OrderItem
     */
    PosTableComponent.prototype.decrementQty = function (OrderItem) {
        var newOrderItem = '';
        var orderItemParsed = JSON.parse(JSON.stringify(OrderItem));
        var parsedOrders = JSON.parse(JSON.stringify(this.parsedOrders));
        parsedOrders.map(function (order) {
            order.OrderItems.map(function (orderItem) {
                if (orderItem.Id === orderItemParsed.Id) {
                    orderItem.Qty = orderItem.Qty - 1;
                    orderItem.TotalAmount = orderItem.Qty * orderItem.UnitPrice;
                    newOrderItem = orderItem;
                }
            });
        });
        if (newOrderItem.Qty >= 1) {
            var requestObject = this.prepareOrderItemRequest(orderItemParsed.OrderId, newOrderItem, parsedOrders, false, false, false, true);
            this.orderStoreApi.decrementQty(requestObject);
        }
    };
    /**
     * Decrements Order Item Quantity by one
     * @param OrderItem
     */
    PosTableComponent.prototype.toogleGiftItem = function (OrderItem) {
        var requestObject = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem);
        this.orderStoreApi.toogleItemAsGift(requestObject);
    };
    /**
     * Function for moving order/ order item form one ticket to other
     * @param OrderItem
     */
    PosTableComponent.prototype.moveItems = function (OrderItem) {
        var _this = this;
        var Orders = this.prepareOrders(OrderItem);
        var requestObjectWithoutMovedOrderItem = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem, Orders.ordersWithoutSelectedOrderItem, true);
        var requestObjectForMovedOrderItem = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem, Orders.ordersWithOnlySelectedItem, true, false, false, false, true);
        if (requestObjectWithoutMovedOrderItem !== null && requestObjectForMovedOrderItem !== null) {
            var moveAction = this.orderApi.moveOrderItems({
                'requestObjectWithoutMovedOrderItem': requestObjectWithoutMovedOrderItem,
                'requestObjectForMovedOrderItem': requestObjectForMovedOrderItem
            });
            moveAction.subscribe(function (moveResponse) {
                moveResponse && _this.redirectAfterItemMove(moveResponse);
            });
        }
    };
    /**
     * Redirects to specific route after an order item is moved
     * @param moveResponse
     */
    PosTableComponent.prototype.redirectAfterItemMove = function (moveResponse) {
        moveResponse.TableId !== '0' && this.router.navigate(['/table/' + moveResponse.TableId + '/move/' + moveResponse.Ticket.Id]);
        moveResponse.CustomerId !== 0 && this.router.navigate(['/customer/' + moveResponse.CustomerId + '/move/' + moveResponse.TicketId]);
    };
    // Update product quantity
    PosTableComponent.prototype.updateQty = function (ItemQuantity) {
        this.qtyFromCalculator = ItemQuantity;
    };
    // Add Product in orders function
    PosTableComponent.prototype.addOrderItem = function (product) {
        var UnSubmittedOrder = this.getUnSubmittedOrder(this.parsedOrders);
        var TempQty = this.qtyFromCalculator ? eval(this.qtyFromCalculator) : 1;
        var ProductTotal = TempQty * product.UnitPrice;
        var VatPercent = 0.13;
        var OrderItem = {
            "UserId": this.currentUser.UserName,
            "FinancialYear": this.currentYear.Name,
            "OrderId": 0,
            "ItemId": product.Id,
            "Qty": TempQty,
            "UnitPrice": product.UnitPrice,
            "TotalAmount": ProductTotal,
            "Tags": ["New Order"],
            "IsSelected": false,
            "IsVoid": false
        };
        this.orderStoreApi.addOrderItem(this.prepareOrderItemRequest(UnSubmittedOrder ? UnSubmittedOrder.OrderNumber : 0, OrderItem, this.parsedOrders, false, true, true));
        this.updateQty('1');
    };
    // Filter and get unsubmitted order
    PosTableComponent.prototype.getUnSubmittedOrder = function (orders) {
        if (orders) {
            return orders.filter(function (order) {
                return order.OrderStatus === "New Order";
            })[0];
        }
    };
    /**
     * Remove Order Item for given order
     * @param OrderItem
     */
    PosTableComponent.prototype.removeItem = function (OrderItem) {
        var Orders = this.prepareOrders(OrderItem);
        var requestObjectWithoutMovedOrderItem = this.prepareOrderItemRequest(OrderItem.OrderId, OrderItem, Orders.ordersWithoutSelectedOrderItem, true);
        var ItemsOrder = Orders.ordersWithoutSelectedOrderItem.filter(function (order) { return order.OrderNumber == OrderItem.OrderNumber; });
        var UnSubmittedOrder = this.getUnSubmittedOrder(ItemsOrder);
        if (UnSubmittedOrder) {
            return this.orderStoreApi.deleteOrderItem(requestObjectWithoutMovedOrderItem);
        }
    };
    /**
     * Prepare the request object for Moving and Deleting the Order Item
     * @param OrderItem {Object} Selected Order Item in the orders
     *
     * @return {Object} Object Containing different Orders list
     */
    PosTableComponent.prototype.prepareOrders = function (OrderItem) {
        var Order;
        var ClonedOrder;
        var OrderItemsLength;
        var ItemIndexInOrders;
        var OrdersWithMovedItem;
        var OrdersWithoutMovedItem;
        OrdersWithoutMovedItem = JSON.parse(JSON.stringify(this.parsedOrders));
        Order = OrdersWithoutMovedItem.filter(function (order) {
            return order.OrderNumber == OrderItem.OrderNumber;
        })[0];
        OrderItemsLength = Order && Order.OrderItems.length;
        OrderItemsLength === 1 && delete Order.OrderItems[0];
        if (OrderItemsLength > 1) {
            for (var i = 0; i < Order.OrderItems.length; i++) {
                if (Order.OrderItems[i].OrderId === OrderItem.OrderId) {
                    ItemIndexInOrders = i;
                    break;
                }
            }
            ItemIndexInOrders !== -1 && Order.OrderItems.splice(ItemIndexInOrders, 1);
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
    };
    /**
     * Checks if the given ticket is submitted or not
     * @param ticket
     */
    PosTableComponent.prototype.isTicketSubmitted = function (ticket) {
        return ticket.isSubmitted === true;
    };
    /**
     * Loads all tickets under given table Id
     * @param tableId
     */
    PosTableComponent.prototype.getTableTickets = function (tableId) {
        this.ticketStoreApi.loadTicketsByTable(tableId);
    };
    /**
     * Gets Orders for given Ticket
     * @param ticket
     */
    PosTableComponent.prototype.getTicketOrders = function (ticket) {
        this.orderStoreApi.loadOrdersByTicket(ticket.Id);
    };
    /**
     * Calls API to lock the given ticket
     */
    PosTableComponent.prototype.printBill = function () {
        this.ticketStoreApi.printBill(this.ticket.Id);
    };
    /**
     * Saves the ticket note in the database
     * @param ticket
     */
    PosTableComponent.prototype.saveTicketNote = function (ticket) {
        ticket && this.ticketStoreApi.addTicketNote(ticket, this.ticketNote);
        this.enableTicketNote = false;
    };
    /**
     * Enable/ Disable the ticket note field
     */
    PosTableComponent.prototype.showTicketNote = function () {
        this.enableTicketNote = !this.enableTicketNote;
    };
    /**
     * Calls the API to create an new ticket on the current table
     */
    PosTableComponent.prototype.createNewTicket = function () {
        if (this.table.TableId) {
            this.router.navigate(['pos/table/' + this.table.TableId + '/empty-ticket']);
        }
        if (this.selectedCustomerId) {
            this.ticketStoreApi.clearAllTickets();
            this.router.navigate(['pos/customer/' + this.selectedCustomerId + '/empty-ticket']);
        }
    };
    // Calculate sum of the items in a order list
    // -> Avoids void and gift items from calculation of total
    PosTableComponent.prototype.calculateSum = function (orders) {
        if (orders === void 0) { orders = []; }
        var totalAmount = 0;
        orders = (orders !== undefined) ? orders : this.parsedOrders;
        if (orders.length) {
            orders.forEach(function (order) {
                totalAmount = totalAmount +
                    (order.OrderItems.length) ? order.OrderItems.reduce(function (total, order) {
                    return total + order.Qty * order.UnitPrice;
                }, 0) : 0;
            });
        }
        return eval(totalAmount.toFixed(2));
    };
    // Calculates Discount
    PosTableComponent.prototype.calculateDiscount = function () {
        return (this.calculateVoidGiftSum() + this.ticket.Discount).toFixed(2);
    };
    /**
     * Calculates the total amount of the payent history
     */
    PosTableComponent.prototype.getTotalCharged = function (ticket) {
        if (!ticket) {
            return 0;
        }
        if (ticket.PaymentHistory) {
            return ticket.PaymentHistory.reduce(function (total, pay) {
                total = total + pay.AmountPaid;
                return total;
            }, 0);
        }
        else {
            return 0;
        }
    };
    /**
    * Get the total balalce of the ticket
    * @param ticket
    */
    PosTableComponent.prototype.getTicketTotalAmount = function (orders) {
        return (orders.length)
            ? this.calculateTicketOrdersSum(orders)
            : 0;
    };
    /**
     * Prepares the order item request object
     *
     * @param orderId
     * @param selectedOrderItem
     */
    PosTableComponent.prototype.prepareOrderItemRequest = function (orderId, selectedOrderItem, parsedOrders, isMove, isAdd, isNew, isIncDec, flag) {
        if (parsedOrders === void 0) { parsedOrders = this.parsedOrders; }
        if (isMove === void 0) { isMove = false; }
        if (isAdd === void 0) { isAdd = false; }
        if (isNew === void 0) { isNew = false; }
        if (isIncDec === void 0) { isIncDec = false; }
        if (flag === void 0) { flag = false; }
        var ticketTotal = 0;
        var serviceCharge = 0;
        var tTotal = this.calculateSum(parsedOrders);
        var cServiceCharge = this.calculateServiceCharge();
        var discountAmount = this.calculateDiscount();
        var ProductTotal = selectedOrderItem.Qty * selectedOrderItem.UnitPrice;
        if (isMove) {
            ticketTotal = (this.ticket.TotalAmount) ? tTotal : tTotal + ProductTotal;
            if (flag === false && eval(discountAmount) > ticketTotal) {
                alert("Discount amount can't be greater than the ticket amount. So, the item can't be moved!");
                return null;
            }
            //serviceCharge = ticketTotal * 0.1;
        }
        else {
            ticketTotal = (this.ticket.TotalAmount)
                ? (isIncDec)
                    ? tTotal
                    : tTotal + ProductTotal
                : ProductTotal;
            //serviceCharge = (ticketTotal - eval(discountAmount)) * 0.1;
        }
        var DiscountedAmount = (flag) ? ticketTotal : ticketTotal - eval(discountAmount);
        var VatPercent = 0.13;
        var Order = this.selectOrderByOrderId(selectedOrderItem.OrderNumber);
        var OrderObject = {
            UserId: this.currentUser.UserName,
            FinancialYear: this.currentYear.Name,
            TicketId: 0,
            TableId: '',
            CustomerId: 0,
            OrderId: 0,
            OrderItem: selectedOrderItem,
            TicketTotal: ticketTotal,
            ServiceCharge: serviceCharge,
            Discount: flag ? 0 : eval(discountAmount) || 0,
            VatAmount: (DiscountedAmount + serviceCharge) * VatPercent,
            GrandTotal: DiscountedAmount + serviceCharge + (DiscountedAmount + serviceCharge) * VatPercent,
            Balance: DiscountedAmount + serviceCharge + (DiscountedAmount + serviceCharge) * VatPercent - this.getTotalCharged(this.ticket)
        };
        OrderObject.OrderItem['UserId'] = this.currentUser.UserName;
        OrderObject.OrderItem['FinancialYear'] = this.currentYear.Name;
        OrderObject.OrderId = this.prepareOrderId(isMove, isAdd, Order, orderId);
        OrderObject.TicketId = this.selectedTicket || 0;
        OrderObject.TableId = this.selectedTable || '0';
        OrderObject.CustomerId = this.selectedCustomerId || 0;
        return OrderObject;
    };
    /**
     * Prepares Order Id based on wether the order is in move or In add state
     */
    PosTableComponent.prototype.prepareOrderId = function (isMove, IsAdd, Order, OrderId) {
        var orderId = 0;
        if (isMove && Order.OrderItems.length === 1) {
            orderId = Order.Id;
        }
        if (IsAdd) {
            orderId = OrderId;
        }
        return orderId;
    };
    /**
     *  Select given Order by Id
     *  @param OrderId {number} Order Id
     */
    PosTableComponent.prototype.selectOrderByOrderId = function (OrderId) {
        var parsedOrder = this.parsedOrders.length && this.parsedOrders.filter(function (order) {
            return order.OrderNumber == OrderId;
        });
        return parsedOrder.length ? parsedOrder[0] : { orderItems: [] };
    };
    /**
     * Calculates Ticket Orders Sum
     */
    PosTableComponent.prototype.calculateTicketOrdersSum = function (orders) {
        var totalAmount = 0;
        if (!orders.length) {
            return totalAmount;
        }
        orders.forEach(function (order) {
            if (order.OrderItems.length) {
                var total_1 = 0;
                order.OrderItems.forEach(function (orderItem) {
                    return (!orderItem.IsVoid && orderItem.Tags.indexOf('Gift') === -1)
                        ? total_1 = total_1 + orderItem.Qty * orderItem.UnitPrice
                        : total_1 = total_1;
                });
                totalAmount = totalAmount + total_1;
            }
            else {
                totalAmount = totalAmount + 0;
            }
        });
        return totalAmount;
    };
    /**
     * Calculates void and gift sum
     */
    PosTableComponent.prototype.calculateVoidGiftSum = function () {
        var totalSum = 0;
        if (this.parsedOrders.length) {
            this.parsedOrders.forEach(function (order) {
                var finalTotal = (order.OrderItems.length) ? order.OrderItems.forEach(function (order) {
                    if (order.IsVoid || (order.Tags && order.Tags.indexOf('Gift')) != -1) {
                        totalSum = totalSum + order.Qty * order.UnitPrice;
                    }
                }) : 0;
            });
        }
        return eval(totalSum.toFixed(2));
    };
    /**
     * Calculates the grand total of the ticket
     */
    PosTableComponent.prototype.getGrandTotal = function () {
        var taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount + taxableAmount * 0.13).toFixed(2);
    };
    /**
     * Calculates the final balace of the ticket
     */
    PosTableComponent.prototype.getFinalBalance = function () {
        return (eval(this.getGrandTotal()) - this.getTotalCharged(this.ticket)).toFixed(2);
    };
    /**
     * checks ticket
     */
    PosTableComponent.prototype.checkTicket = function () {
        return (!this.selectedTicket || this.toOpenTicketId)
            ? true
            : false;
    };
    /**
     * Calculates the Total Service Charge
     */
    PosTableComponent.prototype.calculateServiceCharge = function () {
        //let totalSum = this.calculateSum();
        //let discountAmount = this.calculateDiscount();
        //let ticketTotalAfterDiscount = totalSum - eval(discountAmount);
        //return (ticketTotalAfterDiscount * 0.1).toFixed(2);
        var servicecharge = 0;
        return servicecharge.toFixed(2);
    };
    __decorate([
        core_1.HostListener('window:popstate')
    ], PosTableComponent.prototype, "onPopState", null);
    PosTableComponent = __decorate([
        core_1.Component({
            selector: 'app-pos-table',
            templateUrl: './pos-table.component.html',
            styleUrls: ['./pos-table.component.css']
        })
    ], PosTableComponent);
    return PosTableComponent;
}());
exports.PosTableComponent = PosTableComponent;
