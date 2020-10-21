"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var PosOptionsComponent = /** @class */ (function () {
    // Constructor
    function PosOptionsComponent(activatedRoute, router) {
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.removeItem = new core_1.EventEmitter();
        this.toogleGiftItem = new core_1.EventEmitter();
        this.voidItem = new core_1.EventEmitter();
        this.incrementQty = new core_1.EventEmitter();
        this.decrementQty = new core_1.EventEmitter();
        this.moveItems = new core_1.EventEmitter();
        this.showTicketNote = new core_1.EventEmitter();
        this.createNewTicket = new core_1.EventEmitter();
        this.printBill = new core_1.EventEmitter();
        this.disableButton = true;
    }
    // Initialize data here
    PosOptionsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.orders && this.orders.subscribe(function (orders) {
            _this.parsedOrders = orders;
            return _this.parsedOrders.length
                ? _this.disableButton = false
                : _this.disableButton = true;
        });
    };
    /**
     * Removes item id already submitted else cancel the options
     * @param item
     */
    PosOptionsComponent.prototype.cancel = function (item) {
        (item.Tags.indexOf('New Order') !== -1) && this.removeItem.emit(item);
        this.selectedItem = '';
    };
    // Toggle addition of the tags
    PosOptionsComponent.prototype.addTag = function (selectedItem, tag) {
        var giftIndex = selectedItem.Tags.indexOf('Gift');
        var submittedIndex = selectedItem.Tags.indexOf('Submitted');
        if (submittedIndex === -1 && giftIndex !== -1) {
            selectedItem.Tags.splice(giftIndex, 1);
            selectedItem.TotalAmount = selectedItem.Qty * selectedItem.UnitPrice;
        }
        else {
            selectedItem.Tags.push(tag);
            selectedItem.TotalAmount = 0;
        }
        this.toogleGiftItem.emit(selectedItem);
    };
    // Redirects to tables view
    PosOptionsComponent.prototype.goToTablesView = function () {
        this.router.navigate(['/pos/tables']);
    };
    // Redirects to cuatomers view
    PosOptionsComponent.prototype.goToCustomerView = function () {
        this.router.navigate(['/pos/customers']);
    };
    __decorate([
        core_1.Input('selectedItem')
    ], PosOptionsComponent.prototype, "selectedItem", void 0);
    __decorate([
        core_1.Input('orders')
    ], PosOptionsComponent.prototype, "orders", void 0);
    __decorate([
        core_1.Output()
    ], PosOptionsComponent.prototype, "removeItem", void 0);
    __decorate([
        core_1.Output()
    ], PosOptionsComponent.prototype, "toogleGiftItem", void 0);
    __decorate([
        core_1.Output()
    ], PosOptionsComponent.prototype, "voidItem", void 0);
    __decorate([
        core_1.Output()
    ], PosOptionsComponent.prototype, "incrementQty", void 0);
    __decorate([
        core_1.Output()
    ], PosOptionsComponent.prototype, "decrementQty", void 0);
    __decorate([
        core_1.Output()
    ], PosOptionsComponent.prototype, "moveItems", void 0);
    __decorate([
        core_1.Output()
    ], PosOptionsComponent.prototype, "showTicketNote", void 0);
    __decorate([
        core_1.Output()
    ], PosOptionsComponent.prototype, "createNewTicket", void 0);
    __decorate([
        core_1.Output()
    ], PosOptionsComponent.prototype, "printBill", void 0);
    PosOptionsComponent = __decorate([
        core_1.Component({
            selector: 'pos-options',
            templateUrl: './pos-options.component.html',
            styleUrls: ['./pos-options.component.css']
        })
    ], PosOptionsComponent);
    return PosOptionsComponent;
}());
exports.PosOptionsComponent = PosOptionsComponent;
