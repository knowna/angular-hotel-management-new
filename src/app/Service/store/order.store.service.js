"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var actions = require("../../actions/order.actions");
var OrderStoreService = /** @class */ (function () {
    // Constructor
    function OrderStoreService(store) {
        this.store = store;
    }
    /**
     * Loads kitchen Orders
     */
    OrderStoreService.prototype.loadKitchenOrders = function () {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.LoadKitchenOrdersAction());
    };
    /**
     * Loads orders for given Ticket
     * @param ticketId
     */
    OrderStoreService.prototype.loadOrdersByTicket = function (TicketId) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.LoadOrdersAction({ 'TicketId': TicketId }));
    };
    /**
     * Dispatch event to add given Order Item
     * @param OrderItem
     */
    OrderStoreService.prototype.addOrderItem = function (OrderItem) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.AddProductAction(OrderItem));
    };
    /**
     * Dispatch event to update given Order Item
     * @param OrderId Order Id
     * @param payload Update Order Item
     */
    OrderStoreService.prototype.updateOrderItem = function (OrderItem) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.UpdateOrderItemAction(OrderItem));
    };
    /**
     * Dispatch event to delete given Order Item
     * @param payload {Object}  request Object
     */
    OrderStoreService.prototype.deleteOrderItem = function (payload) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.DeleteProductAction(payload));
    };
    /**
     * Select Order Item
     * @param OrderItem
     */
    OrderStoreService.prototype.selectOrderItem = function (OrderItem) {
        this.store.dispatch(new actions.SelectOrderItemAction({ 'OrderItem': OrderItem }));
    };
    /**
     * Unselect Order Item
     * @param OrderItem
     */
    OrderStoreService.prototype.unSelectOrderItem = function (OrderItem) {
        this.store.dispatch(new actions.DeselectOrderItemAction({ 'OrderItem': OrderItem }));
    };
    /**
     * Void Order Item
     * @param OrderId
     * @param OrderItem
     */
    OrderStoreService.prototype.voidOrderitem = function (orderItemRequest) {
        this.store.dispatch(new actions.UpdateOrderItemAction({ "updateType": "voidOrderItem", "orderItemRequest": orderItemRequest }));
    };
    /**
     * Undo Void Order Item
     * @param OrderId
     * @param OrderItem
     */
    OrderStoreService.prototype.unVoidOrderitem = function (orderItemRequest) {
        this.store.dispatch(new actions.UpdateOrderItemAction({ "updateType": "unVoidOrderItem", "orderItemRequest": orderItemRequest }));
    };
    /**
     * Increment Order Item Quantity
     * @param OrderId
     * @param OrderItem
     */
    OrderStoreService.prototype.incrementQty = function (orderItemRequest) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.UpdateOrderItemAction({ "updateType": "increaseQuantity", "orderItemRequest": orderItemRequest }));
    };
    /**
     * Undo Void Order Item
     * @param OrderId
     * @param OrderItem
     */
    OrderStoreService.prototype.decrementQty = function (orderItemRequest) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.UpdateOrderItemAction({ "updateType": "decreaseQuantity", "orderItemRequest": orderItemRequest }));
    };
    /**
     * Mark Order Item as Gift
     * @param OrderId
     * @param OrderItem
     */
    OrderStoreService.prototype.toogleItemAsGift = function (orderItemRequest) {
        this.store.dispatch(new actions.UpdateOrderItemAction({ "updateType": (orderItemRequest.OrderItem.Tags.indexOf('Gift') !== -1) ? "gift" : "ungift", "orderItemRequest": orderItemRequest }));
    };
    /**
     * Move Order(s) and its items
     * @param payload {Object} Object containing both ticket calculations for without moved Item and with Moved order Item.
     */
    OrderStoreService.prototype.moveOrderItems = function (payload) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.MoveOrderItemAction(payload));
    };
    OrderStoreService = __decorate([
        core_1.Injectable()
    ], OrderStoreService);
    return OrderStoreService;
}());
exports.OrderStoreService = OrderStoreService;
