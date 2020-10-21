import { Action, ActionReducer } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Order, OrderItem } from '../Model/order.model';
import { OrderAction, ActionTypes } from '../actions/order.actions';
import { State, OrderAdapter, InitialState } from '../adapters/order.adapter';

export function OrdersReducer(state: State = InitialState, action: OrderAction) {
    let orderItem: OrderItem;
    
    switch (action.type) {
        case ActionTypes.LOAD_ORDERS_SUCCESS:
            return { ...state, ...OrderAdapter.addAll(action.payload.orders as Order[], state) };

        case ActionTypes.SELECT_ORDER_ITEM:
            let OrderItem = state.entities[action.payload.OrderItem.OrderNumber].OrderItems.filter((item: OrderItem) => {
                return item.ItemId === action.payload.OrderItem.ItemId && item.OrderId === action.payload.OrderItem.OrderId;
            })[0].IsSelected = true;

            return state;

        case ActionTypes.DESELECT_ORDER_ITEM:
            let order = state.entities[action.payload.OrderItem.OrderNumber];
            let orderItem = order && order.OrderItems.filter((item: OrderItem) => {
                return item.ItemId === action.payload.OrderItem.ItemId && item.OrderId === action.payload.OrderItem.OrderId;;
            })[0]
            
            if (orderItem) {
                orderItem.IsSelected = false;
            }

            return state;

        case ActionTypes.ADD_PRODUCT_SUCCESS:
            let existingOrder = action.payload.OrderNumber && state.entities[action.payload.OrderNumber];
            
            (existingOrder) 
                ?  state.entities[action.payload.OrderNumber].OrderItems.push(action.payload.OrderItems[0])
                :  {...state, ...OrderAdapter.addOne(action.payload as Order, state)};

            return state;

        case ActionTypes.UPDATE_PRODUCT_SUCCESS:
            let Item = state.entities[action.payload.OrderId].OrderItems.filter((item: OrderItem) => {
                return item.ItemId === action.payload.OrderItem.ItemId;
            })[0];
            action.payload.OrderItem.IsSelected = true;
            Object.assign(Item, action.payload.OrderItem);

            return state;

        case ActionTypes.DELETE_PRODUCT_SUCCESS:
            let Order = action.payload.OrderNumber && state.entities[action.payload.OrderNumber];
            
            if (Order.OrderItems.length === 1) {
                Order.OrderItems.splice(0,1);
            } else {
                let itemIndex = -1;

                for (let index = 0; index < Order.OrderItems.length; index++) {
                    if (Order.OrderItems[index].Id === action.payload.OrderItems[0].Id) {
                        itemIndex = index;
                    }
                }
                itemIndex !== -1 && Order.OrderItems.splice(itemIndex,1);
            }

            return state;
            
        case ActionTypes.IS_ORDER_LOADING:
            state.IsOrderLoading = true;
            
            return {...state};

        case ActionTypes.IS_ORDER_LOADING_SUCCESS:
            state.IsOrderLoading = false;

            return {...state};

        default:
            return state;
    }
}
