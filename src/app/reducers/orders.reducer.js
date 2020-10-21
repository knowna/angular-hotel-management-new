"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var order_actions_1 = require("../actions/order.actions");
var order_adapter_1 = require("../adapters/order.adapter");
function OrdersReducer(state, action) {
    if (state === void 0) { state = order_adapter_1.InitialState; }
    // console.log(action.type, state);
    var orderItem;
    switch (action.type) {
        case order_actions_1.ActionTypes.LOAD_ORDERS_SUCCESS:
            return __assign({}, state, order_adapter_1.OrderAdapter.addAll(action.payload.orders, state));
        case order_actions_1.ActionTypes.SELECT_ORDER_ITEM:
            var OrderItem_1 = state.entities[action.payload.OrderId].OrderItems.filter(function (item) {
                return item.ItemId === action.payload.ItemId;
            })[0].IsSelected = true;
            return state;
        case order_actions_1.ActionTypes.DESELECT_ORDER_ITEM:
            var order = state.entities[action.payload.OrderId];
            var orderItem_1 = order && order.OrderItems.filter(function (item) {
                return item.ItemId === action.payload.ItemId;
            })[0];
            if (orderItem_1) {
                orderItem_1.IsSelected = false;
            }
            return state;
        case order_actions_1.ActionTypes.ADD_PRODUCT_SUCCESS:
            
            var existingOrder = action.payload.OrderNumber && state.entities[action.payload.OrderNumber];
            (existingOrder)
                ? state.entities[action.payload.OrderNumber].OrderItems.push(action.payload.OrderItems[0])
                : __assign({}, state, order_adapter_1.OrderAdapter.addOne(action.payload, state));
            return state;
        case order_actions_1.ActionTypes.UPDATE_PRODUCT_SUCCESS:
            
            var Item = state.entities[action.payload.OrderId].OrderItems.filter(function (item) {
                return item.ItemId === action.payload.OrderItem.ItemId;
            })[0];
            action.payload.OrderItem.IsSelected = true;
            Object.assign(Item, action.payload.OrderItem);
            return state;
        case order_actions_1.ActionTypes.DELETE_PRODUCT_SUCCESS:
            var Order_1 = action.payload.OrderNumber && state.entities[action.payload.OrderNumber];
            if (Order_1.OrderItems.length === 1) {
                Order_1.OrderItems.splice(0, 1);
            }
            else {
                var itemIndex = -1;
                for (var index = 0; index < Order_1.OrderItems.length; index++) {
                    if (Order_1.OrderItems[index].Id === action.payload.OrderItems[0].Id) {
                        itemIndex = index;
                    }
                }
                itemIndex !== -1 && Order_1.OrderItems.splice(itemIndex, 1);
            }
            return state;
        default:
            return state;
    }
}
exports.OrdersReducer = OrdersReducer;
