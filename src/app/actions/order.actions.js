"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Order Action Types defination
exports.ActionTypes = {
    // Loading Orders
    LOAD_ORDERS: '[Order] -> Load (requested)',
    LOAD_ORDERS_SUCCESS: '[Order] -> Load (completed)',
    LOAD_ERROR: '[Order] -> Load (error)',
    // Getting orders
    GET_ORDER: '[Order] -> Get (completed)',
    // Kitchen Orders
    LOAD_KITCHEN_ORDERS: '[Order] -> Load Kitchen Orders (requested)',
    LOAD_KITCHEN_ORDERS_SUCCESS: '[Order] -> Load Kitchen Orders (completed)',
    // Add product
    ADD_PRODUCT: '[Order] -> Add product (requested)',
    ADD_PRODUCT_SUCCESS: '[Order] -> Add product (completed)',
    // update product
    UPDATE_PRODUCT: '[Order] -> Update product (requested)',
    UPDATE_PRODUCT_SUCCESS: '[Order] -> Update product (completed)',
    // Delete Product
    DELETE_PRODUCT: '[Order] -> Delete product (requested)',
    DELETE_PRODUCT_SUCCESS: '[Order] -> Delete product (completed)',
    // Increment and Decrement Product Quantity
    INCREMENT_QTY: '[Order] -> Increment product Quantity',
    DECREMENT_QTY: '[Order] -> Decrement product Quantity',
    // Select and Deselect Order Item
    SELECT_ORDER_ITEM: '[Order Item] -> Select Order Item',
    DESELECT_ORDER_ITEM: '[Order Item] -> Deleselect Order Item',
    // Void and Unvoid Order Item
    MAKE_ORDER_ITEM_VOID: '[Order Item] -> Make Order Item void',
    UNDO_ORDER_ITEM_VOID: '[Order Item] -> Undo Order Item void',
    // Move order items
    MOVE_ORDER_ITEMS: '[Order Item] -> Move Order Item void',
    MOVE_ORDER_ITEMS_SUCCESS: '[Order Item] -> Move Order Item Success',
    // Move order items
    IS_ORDER_LOADING: '[Order Item] -> Is order loading',
    IS_ORDER_LOADING_SUCCESS: '[Order Item] -> Is order loading Success',
};
// Order Actions defination
// Load payload for single order
var OrderPayLoad = /** @class */ (function () {
    function OrderPayLoad(order) {
        this.order = order;
    }
    return OrderPayLoad;
}());
exports.OrderPayLoad = OrderPayLoad;
// Load payload for all orders
var OrdersPayLoad = /** @class */ (function () {
    function OrdersPayLoad(orders) {
        this.orders = orders;
    }
    return OrdersPayLoad;
}());
exports.OrdersPayLoad = OrdersPayLoad;
// Load ---------------------------------------------
// Load action for orders
var LoadOrdersAction = /** @class */ (function () {
    // Constructor
    function LoadOrdersAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.LOAD_ORDERS;
    }
    return LoadOrdersAction;
}());
exports.LoadOrdersAction = LoadOrdersAction;
// Load action for orders
var LoadKitchenOrdersAction = /** @class */ (function () {
    // Constructor
    function LoadKitchenOrdersAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.LOAD_KITCHEN_ORDERS;
    }
    return LoadKitchenOrdersAction;
}());
exports.LoadKitchenOrdersAction = LoadKitchenOrdersAction;
// On successful load of orders
var LoadKitchenOrdersSuccessAction = /** @class */ (function () {
    // Constructor
    function LoadKitchenOrdersSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.LOAD_KITCHEN_ORDERS_SUCCESS;
    }
    return LoadKitchenOrdersSuccessAction;
}());
exports.LoadKitchenOrdersSuccessAction = LoadKitchenOrdersSuccessAction;
var AddProductAction = /** @class */ (function () {
    // Constructor
    function AddProductAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.ADD_PRODUCT;
    }
    return AddProductAction;
}());
exports.AddProductAction = AddProductAction;
// On successful load of orders
var AddProductSuccessAction = /** @class */ (function () {
    // Constructor
    function AddProductSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.ADD_PRODUCT_SUCCESS;
    }
    return AddProductSuccessAction;
}());
exports.AddProductSuccessAction = AddProductSuccessAction;
var UpdateOrderItemAction = /** @class */ (function () {
    // Constructor
    function UpdateOrderItemAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.UPDATE_PRODUCT;
    }
    return UpdateOrderItemAction;
}());
exports.UpdateOrderItemAction = UpdateOrderItemAction;
// On successful load of orders
var UpdateOrderItemSuccessAction = /** @class */ (function () {
    // Constructor
    function UpdateOrderItemSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.UPDATE_PRODUCT_SUCCESS;
    }
    return UpdateOrderItemSuccessAction;
}());
exports.UpdateOrderItemSuccessAction = UpdateOrderItemSuccessAction;
var DeleteProductAction = /** @class */ (function () {
    // Constructor
    function DeleteProductAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.DELETE_PRODUCT;
    }
    return DeleteProductAction;
}());
exports.DeleteProductAction = DeleteProductAction;
// On successful load of orders
var DeleteProductSuccessAction = /** @class */ (function () {
    // Constructor
    function DeleteProductSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.DELETE_PRODUCT_SUCCESS;
    }
    return DeleteProductSuccessAction;
}());
exports.DeleteProductSuccessAction = DeleteProductSuccessAction;
// On successful load of orders
var LoadOrdersSuccessAction = /** @class */ (function () {
    // Constructor
    function LoadOrdersSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.LOAD_ORDERS_SUCCESS;
    }
    return LoadOrdersSuccessAction;
}());
exports.LoadOrdersSuccessAction = LoadOrdersSuccessAction;
// On unsuccessful load of orders
var LoadErrorAction = /** @class */ (function () {
    // Constructor
    function LoadErrorAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.LOAD_ERROR;
    }
    return LoadErrorAction;
}());
exports.LoadErrorAction = LoadErrorAction;
var SelectOrderItemAction = /** @class */ (function () {
    // Constructor
    function SelectOrderItemAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.SELECT_ORDER_ITEM;
    }
    return SelectOrderItemAction;
}());
exports.SelectOrderItemAction = SelectOrderItemAction;
var DeselectOrderItemAction = /** @class */ (function () {
    // Constructor
    function DeselectOrderItemAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.DESELECT_ORDER_ITEM;
    }
    return DeselectOrderItemAction;
}());
exports.DeselectOrderItemAction = DeselectOrderItemAction;
var MoveOrderItemAction = /** @class */ (function () {
    // Constructor
    function MoveOrderItemAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.MOVE_ORDER_ITEMS;
    }
    return MoveOrderItemAction;
}());
exports.MoveOrderItemAction = MoveOrderItemAction;
var MoveOrderItemSuccessAction = /** @class */ (function () {
    // Constructor
    function MoveOrderItemSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.MOVE_ORDER_ITEMS_SUCCESS;
    }
    return MoveOrderItemSuccessAction;
}());
exports.MoveOrderItemSuccessAction = MoveOrderItemSuccessAction;
var IsOrderLoadingAction = /** @class */ (function () {
    // Constructor
    function IsOrderLoadingAction(payload) {
        if (payload === void 0) { payload = true; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.IS_ORDER_LOADING;
    }
    return IsOrderLoadingAction;
}());
exports.IsOrderLoadingAction = IsOrderLoadingAction;
var IsOrderLoadingSuccessAction = /** @class */ (function () {
    // Constructor
    function IsOrderLoadingSuccessAction(payload) {
        if (payload === void 0) { payload = false; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.IS_ORDER_LOADING_SUCCESS;
    }
    return IsOrderLoadingSuccessAction;
}());
exports.IsOrderLoadingSuccessAction = IsOrderLoadingSuccessAction;
