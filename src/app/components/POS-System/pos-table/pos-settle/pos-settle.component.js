"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment");
// Selectors
var ProductSelector = require("../../../selectors/product.selector");
var TicketSelector = require("../../../selectors/ticket.selector");
var TableSelector = require("../../../selectors/table.selector");
var CustomerSelector = require("../../../selectors/customer.selector");
var OrderSelector = require("../../../selectors/order.selector");
var PosSettleComponent = /** @class */ (function () {
    // Constructor
    function PosSettleComponent(store, activatedRoute, orderStoreApi, ticketStoreApi, _location) {
        var _this = this;
        this.store = store;
        this.activatedRoute = activatedRoute;
        this.orderStoreApi = orderStoreApi;
        this.ticketStoreApi = ticketStoreApi;
        this._location = _location;
        this.parsedOrders = [];
        this.selectedCustomerId = 0;
        this.selectedValue = '';
        this.totalPayable = '';
        this.totalPayableInt = 0;
        this.voidGiftSum = 0;
        this.actionMessage = '';
        this.isLoading = false;
        this.hasRefundable = false;
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.activatedRoute.params.subscribe(function (params) {
            if (_this.selectedTicket) {
                _this.orderStoreApi.loadOrdersByTicket(_this.selectedTicket);
            }
        });
    }
    PosSettleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.table$ = this.store.select(TableSelector.getCurrentTable);
        this.products$ = this.store.select(ProductSelector.getAllProducts);
        this.ticketsLoading$ = this.store.select(TicketSelector.getLoadingStatus);
        this.ticket$ = this.store.select(TicketSelector.getCurrentTicket);
        this.ordersLoading$ = this.store.select(OrderSelector.getLoadingStatus);
        this.orders$ = this.store.select(OrderSelector.getAllOrders);
        this.ticketMessage$ = this.store.select(TicketSelector.getTicketMessage);
        this.customerId$ = this.store.select(CustomerSelector.getCurrentCustomerId);
        this.customer$ = this.store.select(CustomerSelector.getCurrentCustomer);
        // Subscriptions
        this.ticket$.subscribe(function (ticket) {
            if (ticket) {
                _this.ticket = ticket;
                _this.totalPayable = _this.getFinalBalance().toFixed(2);
                _this.selectedCustomerId = ticket.CustomerId;
                _this.selectedValue = '';
                _this.isLoading = false;
            }
        });
        this.table$.subscribe(function (table) {
            if (table) {
                _this.table = table;
            }
        });
        this.customerId$.subscribe(function (customerId) {
            _this.selectedCustomerId = customerId ? customerId : 0;
        });
        this.orders$.subscribe(function (orders) {
            if (orders.length) {
                _this.parsedOrders = _this.mergeDuplicateItems(orders);
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
     * Merge Duplicate Items
     */
    PosSettleComponent.prototype.mergeDuplicateItems = function (orders) {
        var orders = JSON.parse(JSON.stringify(orders));
        orders.forEach(function (order) {
            var counts = [];
            order.OrderItems.forEach(function (a, i) {
                if (counts[a.ItemId] === undefined) {
                    counts[a.ItemId] = a;
                }
                else {
                    counts[a.ItemId].Qty += a.Qty;
                }
            });
            order.OrderItems = counts;
            order.OrderItems = order.OrderItems.filter(function (n) { return n != undefined; });
        });
        return orders;
    };
    // Calculate sum of the items in a order list
    // -> Avoids void and gift items from calculation of total
    PosSettleComponent.prototype.calculateSum = function () {
        var totalAmount = 0;
        if (this.parsedOrders.length) {
            this.parsedOrders.forEach(function (order) {
                totalAmount = totalAmount +
                    (order.OrderItems.length) ? order.OrderItems.reduce(function (total, order) {
                    return total + order.Qty * order.UnitPrice;
                }, 0) : 0;
            });
        }
        return eval(totalAmount.toFixed(2));
    };
    /**
     * Calculates void and gift sum
     */
    PosSettleComponent.prototype.calculateVoidGiftSum = function () {
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
     * Filter product by product ID
     * @param products
     * @param productId
     */
    PosSettleComponent.prototype.getProductById = function (products, productId) {
        var products = products.filter(function (product) { return product.Id === productId; });
        // Return product
        return products.length ? products[0] : {};
    };
    // Calculates Discount
    PosSettleComponent.prototype.calculateDiscount = function () {
        var sum = this.calculateSum();
        var giftSum = this.calculateVoidGiftSum();
        var value = (giftSum / sum) * 100 || 0;
        return (this.ticket.Discount)
            ? this.ticket.Discount.toFixed(2)
            : (sum * (value / 100)).toFixed(2);
    };
    // Calculates VAT Amount
    PosSettleComponent.prototype.calculateVat = function () {
        var taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount * 0.13).toFixed(2);
    };
    /**
     * Calculates the grand total of the ticket
     */
    PosSettleComponent.prototype.getGrandTotal = function () {
        var taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount + taxableAmount * 0.13).toFixed(2);
    };
    /**
     * Calculates the final balace of the ticket
     */
    PosSettleComponent.prototype.getFinalBalance = function () {
        var finalBalance = 0;
        var balanceCalc = eval(this.getGrandTotal()) - this.getTotalCharged(this.ticket);
        if (balanceCalc < 0) {
            this.hasRefundable = true;
            this.totalPayable = '0.00';
            this.totalPayableInt = 0;
            finalBalance = balanceCalc * (-1);
        }
        else {
            this.hasRefundable = false;
            finalBalance = balanceCalc;
            this.totalPayable = finalBalance.toFixed(2);
            this.totalPayableInt = finalBalance;
        }
        return finalBalance;
    };
    /**
     * Select a value form the table
     * @param value
     */
    PosSettleComponent.prototype.selectValue = function (value) {
        if (value === 'C') {
            this.selectedValue = '';
        }
        else {
            if (this.selectedValue.indexOf('.') === -1 || value !== '.') {
                this.selectedValue = this.selectedValue + value;
            }
        }
    };
    /**
     * Adds discount to the total ticket amount
     */
    PosSettleComponent.prototype.addDiscount = function () {
        var r = confirm("Are you sure you want to continue?");
        if (r === false) {
            return false;
        }
        var previousPayment = this.getTotalCharged(this.ticket);
        var ticketTotal = this.calculateSum();
        var finalBalance = this.getFinalBalance();
        var discountAmt = eval(this.selectedValue) / 100 * ticketTotal;
        var isValid = previousPayment
            ? (discountAmt > finalBalance)
                ? 0
                : discountAmt
            : (discountAmt > ticketTotal)
                ? 0
                : discountAmt;
        if (!isValid) {
            alert("Discount (%) can't be greater than Ticket Total or Remaining Balance.");
            return false;
        }
        else {
            this.ticket.Discount = isValid;
            this.addTicketDiscount(this.ticket);
        }
    };
    /**
     * Calculates Last payment time
     * @param ticket
     */
    PosSettleComponent.prototype.getLastPaymentTime = function (ticket) {
        return ticket && ticket.PaymentHistory.length && this.getDate(ticket.PaymentHistory[0].DateTime);
    };
    /**
     * Calculates total charged amount
     * @param ticket
     */
    PosSettleComponent.prototype.getTotalCharged = function (ticket) {
        return ticket.PaymentHistory.reduce(function (total, pay) {
            total = total + pay.AmountPaid;
            return total;
        }, 0);
    };
    /**
     * Gets formatted date
     * @param date
     */
    PosSettleComponent.prototype.getDate = function (date) {
        return moment(date).format("DD/MM/YYYY HH:mm:ss A");
    };
    // Call to make the ticket pay by cash
    PosSettleComponent.prototype.payCash = function (ticket) {
        var r = confirm("Are you sure you want to continue?");
        if (r == false) {
            return false;
        }
        // if (this.selectedValue > eval(this.getFinalBalance().toString())) {
        //     alert("Charged amount can't be greater than ticket final balance.");
        //     return false;
        // }
        this.isLoading = true;
        this.ticketStoreApi.payByCash(ticket.Id, {
            "TicketId": ticket.Id,
            "Charged": this.selectedValue,
            "Discount": this.ticket.Discount,
            "PaymentMode": "Cash",
            "FinancialYear": this.currentYear.Name,
            "UserName": this.currentUser.UserName
        });
    };
    // Call to make the ticket pay by card  
    PosSettleComponent.prototype.payByCard = function (ticket) {
        // if (this.selectedValue > eval(this.getFinalBalance().toString())) {
        //     alert("Charged amount can't be greater than ticket final balance.");
        //     return false;
        // }
        var r = confirm("Are you sure you want to continue?");
        if (r == false) {
            return false;
        }
        this.isLoading = true;
        this.ticketStoreApi.payByCard(ticket.Id, {
            "TicketId": ticket.Id,
            "Charged": this.selectedValue,
            "Discount": this.ticket.Discount,
            "PaymentMode": "Card",
            "FinancialYear": this.currentYear.Name,
            "UserName": this.currentUser.UserName
        });
    };
    // Call to make the ticket pay by voucher
    PosSettleComponent.prototype.payVoucher = function (ticket) {
        // if (this.selectedValue > eval(this.getFinalBalance().toString())) {
        //     alert("Charged amount can't be greater than ticket final balance.");
        //     return false;
        // }
        var r = confirm("Are you sure you want to continue?");
        if (r == false) {
            return false;
        }
        this.isLoading = true;
        this.ticketStoreApi.payByVoucher(ticket.Id, {
            "TicketId": ticket.Id,
            "Charged": this.selectedValue,
            "Discount": this.ticket.Discount,
            "PaymentMode": "Voucher",
            "FinancialYear": this.currentYear.Name,
            "UserName": this.currentUser.UserName
        });
    };
    // Call to make the ticket pay by customer account
    PosSettleComponent.prototype.payCustomerAmount = function (ticket) {
        // if (this.selectedValue > eval(this.getFinalBalance().toString())) {
        //     alert("Charged amount can't be greater than ticket final balance.");
        //     return false;
        // }
        var r = confirm("Are you sure you want to continue?");
        if (r == false) {
            return false;
        }
        this.isLoading = true;
        this.ticketStoreApi.payCustomerAccount(ticket.Id, {
            "TicketId": ticket.Id,
            "Charged": this.selectedValue,
            "Discount": this.ticket.Discount,
            "PaymentMode": "Customer",
            "FinancialYear": this.currentYear.Name,
            "UserName": this.currentUser.UserName
        });
    };
    // Call to make the ticket round offed
    PosSettleComponent.prototype.roundTicket = function (ticket) {
        this.isLoading = false;
        this.ticketStoreApi.roundTicket(ticket.Id, {
            "TicketId": ticket.Id,
            "Charged": this.selectedValue,
            "Discount": this.ticket.Discount,
            "PaymentMode": "TicketRound",
            "FinancialYear": this.currentYear.Name,
            "UserName": this.currentUser.UserName
        });
    };
    // Call to make the ticket round offed
    PosSettleComponent.prototype.addTicketDiscount = function (ticket) {
        this.isLoading = true;
        this.ticketStoreApi.addDiscount({
            "TicketId": ticket.Id,
            "charged": 0,
            "discount": this.ticket.Discount,
            "PaymentMode": "Discount",
            "FinancialYear": this.currentYear.Name,
            "UserName": this.currentUser.UserName,
            "PosSettle": this.prepareRequestObject()
        });
    };
    /**
     * Calculates the Total Service Charge
     */
    PosSettleComponent.prototype.calculateServiceCharge = function () {
        //let totalSum = this.calculateSum();
        //let discountAmount = this.calculateDiscount();
        //let ticketTotalAfterDiscount = totalSum - eval(discountAmount);
        //return (ticketTotalAfterDiscount * 0.1).toFixed(2);
        var servicecharge = 0;
        return servicecharge.toFixed(2);
    };
    // Call to make the ticket round offed
    PosSettleComponent.prototype.printBill = function (ticket) {
        this.isLoading = true;
        this.ticketStoreApi.printBill(ticket.Id);
    };
    // Go back to last page
    PosSettleComponent.prototype.close = function (ticket) {
        this._location.back();
    };
    // Chooses the selected value
    PosSettleComponent.prototype.choose = function (value) {
        this.selectedValue = value;
    };
    /**
     * Prepares the Request Object
     */
    PosSettleComponent.prototype.prepareRequestObject = function () {
        return {
            TicketId: this.ticket.Id,
            TableId: this.table ? this.table.TableId : '',
            CustomerId: this.selectedCustomerId || '',
            OrderId: '',
            OrderItem: '',
            Discount: this.ticket.Discount,
            TicketTotal: (this.calculateSum()).toFixed(2),
            ServiceCharge: this.calculateServiceCharge(),
            VatAmount: this.calculateVat(),
            GrandTotal: this.getGrandTotal(),
            Balance: this.getFinalBalance().toFixed(2),
            RemainingBalance: this.hasRefundable ? (this.getFinalBalance() * (-1)).toFixed(2) : (0).toFixed(2)
        };
    };
    PosSettleComponent = __decorate([
        core_1.Component({
            selector: 'app-pos-settle',
            templateUrl: './pos-settle.component.html',
            styleUrls: ['./pos-settle.component.css']
        })
    ], PosSettleComponent);
    return PosSettleComponent;
}());
exports.PosSettleComponent = PosSettleComponent;
