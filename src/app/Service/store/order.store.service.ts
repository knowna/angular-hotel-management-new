import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Order, OrderItem, OrderItemRequest } from '../../Model/order.model';
import { Observable } from 'rxjs/Observable';

import * as actions from '../../actions/order.actions';

@Injectable(
    {providedIn:'root'}
)
export class OrderStoreService {

    // Constructor
    constructor(private store: Store<any>) { }

    /**
     * Loads kitchen Orders
     */
    loadKitchenOrders () {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.LoadKitchenOrdersAction());
    }

    /**
	 * Loads orders for given Ticket
	 * @param ticketId 
	 */
    loadOrdersByTicket(TicketId: number) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.LoadOrdersAction({ 'TicketId': TicketId }));
    }

    /**
     * Dispatch event to add given Order Item
     * @param OrderItem 
     */
    addOrderItem(OrderItem: OrderItemRequest) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.AddProductAction(OrderItem));
    }

    /**
     * Dispatch event to update given Order Item
     * @param OrderId Order Id
     * @param payload Update Order Item
     */
    updateOrderItem(OrderItem: OrderItemRequest) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.UpdateOrderItemAction(OrderItem));
    }

    /**
     * Dispatch event to delete given Order Item
     * @param payload {Object}  request Object
     */
    deleteOrderItem(payload: OrderItemRequest) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.DeleteProductAction(payload));
    }

    /**
     * Select Order Item
     * @param OrderItem
     */
    selectOrderItem(OrderItem: OrderItem) {
        this.store.dispatch(new actions.SelectOrderItemAction({ 'OrderItem': OrderItem }));
    }

    /**
     * Unselect Order Item
     * @param OrderItem
     */
    unSelectOrderItem(OrderItem: OrderItem) {
        this.store.dispatch(new actions.DeselectOrderItemAction({ 'OrderItem': OrderItem }));
    }

    /**
     * Void Order Item
     * @param OrderId 
     * @param OrderItem 
     */
    voidOrderitem(orderItemRequest: OrderItemRequest) {
        this.store.dispatch(
            new actions.UpdateOrderItemAction({ "updateType": "voidOrderItem", "orderItemRequest": orderItemRequest})
        );
    }

    /**
     * Undo Void Order Item
     * @param OrderId 
     * @param OrderItem 
     */
    unVoidOrderitem(orderItemRequest: OrderItemRequest) {
        this.store.dispatch(
            new actions.UpdateOrderItemAction({ "updateType": "unVoidOrderItem", "orderItemRequest": orderItemRequest})
            
        );
    }

    /**
     * Increment Order Item Quantity
     * @param OrderId 
     * @param OrderItem 
     */
    incrementQty(orderItemRequest: OrderItemRequest) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.UpdateOrderItemAction({ "updateType": "increaseQuantity", "orderItemRequest": orderItemRequest}));
    }

    /**
     * Undo Void Order Item
     * @param OrderId 
     * @param OrderItem 
     */
    decrementQty(orderItemRequest: OrderItemRequest) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.UpdateOrderItemAction({ "updateType": "decreaseQuantity", "orderItemRequest": orderItemRequest}));
    }

    /**
     * Mark Order Item as Gift
     * @param OrderId 
     * @param OrderItem 
     */
    toogleItemAsGift(orderItemRequest: OrderItemRequest) {
        this.store.dispatch(
            new actions.UpdateOrderItemAction({ "updateType": (orderItemRequest.OrderItem.Tags.indexOf('Gift') !==-1) ? "gift" : "ungift", "orderItemRequest": orderItemRequest})
        );
    }

    /**
     * Move Order(s) and its items
     * @param payload {Object} Object containing both ticket calculations for without moved Item and with Moved order Item.
     */
    moveOrderItems(payload: any) {
        this.store.dispatch(new actions.IsOrderLoadingAction());
        this.store.dispatch(new actions.MoveOrderItemAction(payload));
    }
}