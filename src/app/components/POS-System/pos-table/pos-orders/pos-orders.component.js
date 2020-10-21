"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var _ = require("lodash");
var moment = require("moment");
// Selectors
var CustomerSelector = require("../../../selectors/customer.selector");
var PosOrdersComponent = /** @class */ (function () {
    // Constructor
    function PosOrdersComponent(store, activatedRoute, router, userStoreService, _location) {
        this.store = store;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.userStoreService = userStoreService;
        this._location = _location;
        this.selectOrderItem = new core_1.EventEmitter();
        this.selected = '';
        this.isSelected = false;
        this.voidGiftSum = 0;
    }
    // On component Init
    PosOrdersComponent.prototype.ngOnInit = function () {
        this.user$ = this.userStoreService.user$;
        this.customer$ = this.store.select(CustomerSelector.getCurrentCustomer);
    };
    // Calculates Discount
    PosOrdersComponent.prototype.calculateDiscount = function () {
        var sum = this.calculateSum();
        var giftSum = this.calculateVoidGiftSum();
        var value = (giftSum / sum) * 100 || 0;
        return (this.ticket.Discount)
            ? this.ticket.Discount.toFixed(2)
            : (sum * (value / 100)).toFixed(2);
    };
    /**
     * Filter product by product ID
     * @param products
     * @param productId
     */
    PosOrdersComponent.prototype.getProductById = function (products, productId) {
        var products = this.products.filter(function (product) { return product.Id === productId; });
        // Return product
        return products.length ? products[0] : {};
    };
    /**
     *  Get the latest order time
     * @param orders
     * @return Date
     */
    PosOrdersComponent.prototype.getLastOrderTime = function (orders) {
        var orderOpeningTimes = [];
        orders.map(function (order) {
            // Order opening time should be in number format
            orderOpeningTimes.push(new Date(order.OrderOpeningTime).getTime());
        });
        return moment(_.max(orderOpeningTimes)).format("DD/MM/YYYY hh:mm:ss A");
    };
    // Calculate sum of the items in a order list
    // -> Avoids void and gift items from calculation of total
    PosOrdersComponent.prototype.calculateSum = function () {
        var totalAmount = 0;
        if (this.orders.length) {
            this.orders.forEach(function (order) {
                totalAmount = totalAmount +
                    (order.OrderItems.length) ? order.OrderItems.reduce(function (total, order) {
                    return total + order.Qty * order.UnitPrice;
                }, 0) : 0;
            });
        }
        return eval(totalAmount.toFixed(2));
    };
    /**
     * Calculates the Total Service Charge
     */
    PosOrdersComponent.prototype.calculateServiceCharge = function () {
        //let totalSum = this.calculateSum();
        //let discountAmount = this.calculateDiscount();
        //let ticketTotalAfterDiscount = totalSum - eval(discountAmount);
        //return (ticketTotalAfterDiscount * 10/100).toFixed(2);
        return (0).toFixed(2);
    };
    // Calculates VAT amount
    PosOrdersComponent.prototype.calculateVat = function () {
        var taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount * 0.13).toFixed(2);
    };
    /**
     * Gets date
     */
    PosOrdersComponent.prototype.getDate = function (date) {
        return date ? moment(date).format("DD/MM/YYYY hh:mm:ss A") : '-';
    };
    /**
     * Gets payment time
     */
    PosOrdersComponent.prototype.getLastPaymentTime = function (ticket) {
        return ticket && ticket.PaymentHistory.length && ticket.PaymentHistory[0].DateTime && this.getDate(ticket.PaymentHistory[0].DateTime);
    };
    /**
     * Gets total charged
     */
    PosOrdersComponent.prototype.getTotalCharged = function (ticket) {
        return ticket && ticket.PaymentHistory.length && ticket.PaymentHistory.reduce(function (total, pay) {
            total = total + pay.AmountPaid;
            return total;
        }, 0);
    };
    // Go back to last page
    PosOrdersComponent.prototype.close = function () {
        this.router.navigate(['/pos/tables']);
    };
    /**
     * Calculates void and gift sum
     */
    PosOrdersComponent.prototype.calculateVoidGiftSum = function () {
        var totalSum = 0;
        if (this.orders.length) {
            this.orders.forEach(function (order) {
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
    PosOrdersComponent.prototype.getGrandTotal = function () {
        var taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount + taxableAmount * 0.13).toFixed(2);
    };
    /**
     * Calculates the final balace of the ticket
     */
    PosOrdersComponent.prototype.getFinalBalance = function () {
        return (eval(this.getGrandTotal()) - this.getTotalCharged(this.ticket)).toFixed(2);
    };
    __decorate([
        core_1.Input('table')
    ], PosOrdersComponent.prototype, "table", void 0);
    __decorate([
        core_1.Input('ticket')
    ], PosOrdersComponent.prototype, "ticket", void 0);
    __decorate([
        core_1.Input('products')
    ], PosOrdersComponent.prototype, "products", void 0);
    __decorate([
        core_1.Input('orders')
    ], PosOrdersComponent.prototype, "orders", void 0);
    __decorate([
        core_1.Input('selectedTable')
    ], PosOrdersComponent.prototype, "selectedTable", void 0);
    __decorate([
        core_1.Input('selectedCustomerId')
    ], PosOrdersComponent.prototype, "selectedCustomerId", void 0);
    __decorate([
        core_1.Output()
    ], PosOrdersComponent.prototype, "selectOrderItem", void 0);
    PosOrdersComponent = __decorate([
        core_1.Component({
            selector: 'pos-orders',
            templateUrl: './pos-orders.component.html',
            styleUrls: ['./pos-orders.component.css']
        })
    ], PosOrdersComponent);
    return PosOrdersComponent;
}());
exports.PosOrdersComponent = PosOrdersComponent;
