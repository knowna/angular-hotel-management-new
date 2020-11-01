"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var global_1 = require("../../../../Shared/global");
// Selectors
var ProductSelector = require("../../../../selectors/product.selector");
var TicketSelector = require("../../../../selectors/ticket.selector");
var OrderSelector = require("../../../../selectors/order.selector");
require("jspdf-autotable");
var PosCustomerComponent = /** @class */ (function () {
    // Constructor
    function PosCustomerComponent(store, _location, _purchaseService) {
        this.store = store;
        this._location = _location;
        this._purchaseService = _purchaseService;
        this.parsedOrders = [];
        this.company = {};
        this.company = JSON.parse(localStorage.getItem('company'));
    }
    PosCustomerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ticket$ = this.store.select(TicketSelector.getCurrentTicket);
        this.orders$ = this.store.select(OrderSelector.getAllOrders);
        this.products$ = this.store.select(ProductSelector.getAllProducts);
        // Subscriptions
        this.ticket$.subscribe(function (ticket) {
            if (ticket) {
                _this.ticket = ticket;
            }
        });
        this.orders$.subscribe(function (orders) {
            if (orders.length) {
                _this.parsedOrders = _this.mergeDuplicateItems(orders);
            }
        });
    };
    /**
     * Item Price
     * @param UnitPrice
     */
    PosCustomerComponent.prototype.CurrentUnitPrice = function (UnitPrice) {
        var currentprice = UnitPrice / 1.13;
        // Return product
        return currentprice.toFixed(2);
    };
    /**
     * Item Price
     * @param UnitPrice
     * @param Qty
     */
    PosCustomerComponent.prototype.ProductPrice = function (UnitPrice, Qty) {
        var currentprice = UnitPrice / 1.13 * Qty;
        // Return product
        return currentprice.toFixed(2);
    };
    /**
     * Filter product by product ID
     * @param products
     * @param productId
     */
    PosCustomerComponent.prototype.getProductById = function (products, productId) {
        var products = products.filter(function (product) { return product.Id === productId; });
        // Return product
        return products.length ? products[0] : {};
    };
    /**
     * Merge Duplicate Items
     */
    PosCustomerComponent.prototype.mergeDuplicateItems = function (orders) {
        debugger;
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
    PosCustomerComponent.prototype.calculateSum = function () {
        var totalAmount = 0;
        debugger;
        if (this.parsedOrders.length) {
            this.parsedOrders.forEach(function (order) {
                totalAmount = totalAmount +
                    (order.OrderItems.length) ? order.OrderItems.reduce(function (total, order) {
                    return total + order.Qty * order.UnitPrice / 1.13;
                }, 0) : 0;
            });
        }
        return eval(totalAmount.toFixed(2));
    };
    // Calculates Discount
    PosCustomerComponent.prototype.calculateDiscount = function () {
        var sum = this.calculateSum();
        var giftSum = this.calculateVoidGiftSum();
        var value = (giftSum / sum) * 100 || 0;
        return (this.ticket.Discount)
            ? this.ticket.Discount.toFixed(2)
            : (sum * (value / 100)).toFixed(2);
    };
    /**
     * Calculates void and gift sum
     */
    PosCustomerComponent.prototype.calculateVoidGiftSum = function () {
        var totalSum = 0;
        if (this.parsedOrders.length) {
            this.parsedOrders.forEach(function (order) {
                var finalTotal = (order.OrderItems.length) ? order.OrderItems.forEach(function (order) {
                    if (order.IsVoid || (order.Tags && order.Tags.indexOf('Gift')) != -1) {
                        totalSum = totalSum + order.Qty * eval((order.UnitPrice / 1.13).toFixed(2));
                    }
                }) : 0;
            });
        }
        return eval(totalSum.toFixed(2));
    };
    // Calculates Taxable Amount
    PosCustomerComponent.prototype.calculateTaxableAmount = function () {
        var sum = this.calculateSum();
        var Discount = this.ticket.Discount;
        var TaxableAmount = sum - Discount;
        return TaxableAmount;
    };
    // Calculates VAT Amount
    PosCustomerComponent.prototype.calculateVat = function () {
        var taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount * 0.13).toFixed(2);
    };
    /**
     * Calculates the grand total of the ticket
     */
    PosCustomerComponent.prototype.getGrandTotal = function () {
        var taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount + taxableAmount * 0.13).toFixed(2);
    };
    /**
     * Calculates the Total Service Charge
     */
    PosCustomerComponent.prototype.calculateServiceCharge = function () {
        //let totalSum = this.calculateSum();
        //let discountAmount = this.calculateDiscount();
        //let ticketTotalAfterDiscount = totalSum - eval(discountAmount);
        //return (ticketTotalAfterDiscount * 0.1).toFixed(2);
        var servicecharge = 0;
        return servicecharge.toFixed(2);
    };
    // Go back to last page
    PosCustomerComponent.prototype.close = function () {
        this._location.back();
    };
    /**
     * Calculates the final balace of the ticket
     */
    PosCustomerComponent.prototype.getFinalBalance = function () {
        var finalBalance = 0;
        var balanceCalc = eval(this.getGrandTotal()) - this.getTotalCharged(this.ticket);
        if (balanceCalc < 0) {
            finalBalance = balanceCalc * (-1);
        }
        else {
            finalBalance = balanceCalc;
        }
        return finalBalance;
    };
    /**
     * Calculates total charged amount
     * @param ticket
     */
    PosCustomerComponent.prototype.getTotalCharged = function (ticket) {
        return ticket.PaymentHistory.reduce(function (total, pay) {
            total = total + pay.AmountPaid;
            return total;
        }, 0);
    };
    //Transfer Bill
    PosCustomerComponent.prototype.TransferBill = function (ticket) {
        var r = confirm("Are you sure you want to continue?");
        if (r == false) {
            return false;
        }
    };
    /**
     * Gets individual journal voucher
     * @param Id
     */
    PosCustomerComponent.prototype.getPrintInvoice = function (Id, AmountWord) {
        return this._purchaseService.get(global_1.Global.BASE_ORDERINVOICEPRINT_ENDPOINT + '?TicketNo=' + Id + '&InvoiceAmount=' + AmountWord);
    };
    PosCustomerComponent = __decorate([
        core_1.Component({
            selector: 'app-pos-customer',
            templateUrl: './pos-customer.component.html',
            styleUrls: ['./pos-customer.component.css']
        })
    ], PosCustomerComponent);
    return PosCustomerComponent;
}());
exports.PosCustomerComponent = PosCustomerComponent;
