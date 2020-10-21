import { Action } from '@ngrx/store';
import { Order } from '../Model/order.model';

// Order Action Types defination
export const ActionTypes = {
	// Loading Orders
	LOAD_ORDERS: 			'[Order] -> Load (requested)',
	LOAD_ORDERS_SUCCESS: 	'[Order] -> Load (completed)',
	LOAD_ERROR: 			'[Order] -> Load (error)',

	// Getting orders
	GET_ORDER: 				'[Order] -> Get (completed)',

	// Kitchen Orders
	LOAD_KITCHEN_ORDERS: 			'[Order] -> Load Kitchen Orders (requested)',
	LOAD_KITCHEN_ORDERS_SUCCESS: 	'[Order] -> Load Kitchen Orders (completed)',

	// Add product
	ADD_PRODUCT: 			'[Order] -> Add product (requested)',
	ADD_PRODUCT_SUCCESS: 	'[Order] -> Add product (completed)',

	// update product
	UPDATE_PRODUCT: 		'[Order] -> Update product (requested)',
	UPDATE_PRODUCT_SUCCESS: '[Order] -> Update product (completed)',

	// Delete Product
	DELETE_PRODUCT: 		'[Order] -> Delete product (requested)',
	DELETE_PRODUCT_SUCCESS: '[Order] -> Delete product (completed)',

	// Increment and Decrement Product Quantity
	INCREMENT_QTY: 			'[Order] -> Increment product Quantity',
	DECREMENT_QTY: 			'[Order] -> Decrement product Quantity',

	// Select and Deselect Order Item
	SELECT_ORDER_ITEM: 		'[Order Item] -> Select Order Item',
	DESELECT_ORDER_ITEM: 	'[Order Item] -> Deleselect Order Item',

	// Void and Unvoid Order Item
	MAKE_ORDER_ITEM_VOID: 	'[Order Item] -> Make Order Item void',
	UNDO_ORDER_ITEM_VOID: 	'[Order Item] -> Undo Order Item void',

	// Move order items
	MOVE_ORDER_ITEMS: 		'[Order Item] -> Move Order Item void',
	MOVE_ORDER_ITEMS_SUCCESS: 	'[Order Item] -> Move Order Item Success',

	// Move order items
	IS_ORDER_LOADING: 		'[Order Item] -> Is order loading',
	IS_ORDER_LOADING_SUCCESS: 	'[Order Item] -> Is order loading Success',
}

// Order Actions defination
// Load payload for single order
export class OrderPayLoad {
	constructor(public order: Order) { }
}

// Load payload for all orders
export class OrdersPayLoad {
	constructor(public orders: Order[]) { }
}

// Load ---------------------------------------------
// Load action for orders
export class LoadOrdersAction implements Action {
	// Variables
	type = ActionTypes.LOAD_ORDERS;

	// Constructor
	constructor(public payload: any = null) { }
}

// Load action for orders
export class LoadKitchenOrdersAction implements Action {
	// Variables
	type = ActionTypes.LOAD_KITCHEN_ORDERS;

	// Constructor
	constructor(public payload: any = null) { }
}

// On successful load of orders
export class LoadKitchenOrdersSuccessAction implements Action {
	// Variables
	type = ActionTypes.LOAD_KITCHEN_ORDERS_SUCCESS;

	// Constructor
	constructor(public payload: OrdersPayLoad) { }
}

export class AddProductAction implements Action {
	// Variables
	type = ActionTypes.ADD_PRODUCT;

	// Constructor
	constructor(public payload: any = null) { }
}

// On successful load of orders
export class AddProductSuccessAction implements Action {
	// Variables
	type = ActionTypes.ADD_PRODUCT_SUCCESS;

	// Constructor
	constructor(public payload: Order) {}
}

export class UpdateOrderItemAction implements Action {
	// Variables
	type = ActionTypes.UPDATE_PRODUCT;

	// Constructor
	constructor(public payload: any = null) { }
}

// On successful load of orders
export class UpdateOrderItemSuccessAction implements Action {
	// Variables
	type = ActionTypes.UPDATE_PRODUCT_SUCCESS;

	// Constructor
	constructor(public payload: any) { }
}

export class DeleteProductAction implements Action {
	// Variables
	type = ActionTypes.DELETE_PRODUCT;

	// Constructor
	constructor(public payload: any = null) { }
}

// On successful load of orders
export class DeleteProductSuccessAction implements Action {
	// Variables
	type = ActionTypes.DELETE_PRODUCT_SUCCESS;

	// Constructor
	constructor(public payload: Order) { }
}

// On successful load of orders
export class LoadOrdersSuccessAction implements Action {
	// Variables
	type = ActionTypes.LOAD_ORDERS_SUCCESS;

	// Constructor
	constructor(public payload: OrdersPayLoad) { }
}

// On unsuccessful load of orders
export class LoadErrorAction implements Action {
	// Variables
	type = ActionTypes.LOAD_ERROR;

	// Constructor
	constructor(public payload: string) { }
}

export class SelectOrderItemAction implements Action {
	// Variables
	type = ActionTypes.SELECT_ORDER_ITEM;

	// Constructor
	constructor(public payload: any) { }
}

export class DeselectOrderItemAction implements Action {
	// Variables
	type = ActionTypes.DESELECT_ORDER_ITEM;

	// Constructor
	constructor(public payload: any) { }
}

export class MoveOrderItemAction implements Action {
	// Variables
	type = ActionTypes.MOVE_ORDER_ITEMS;

	// Constructor
	constructor(public payload: any = null) { }
}

export class MoveOrderItemSuccessAction implements Action {
	// Variables
	type = ActionTypes.MOVE_ORDER_ITEMS_SUCCESS;

	// Constructor
	constructor(public payload: any) { }
}

export class IsOrderLoadingAction implements Action {
	// Variables
	type = ActionTypes.IS_ORDER_LOADING;

	// Constructor
	constructor(public payload: boolean = true) { }
}

export class IsOrderLoadingSuccessAction implements Action {
	// Variables
	type = ActionTypes.IS_ORDER_LOADING_SUCCESS;

	// Constructor
	constructor(public payload: boolean = false) { }
}

// Export Order(s) Actions
export type OrderAction
	= LoadOrdersAction
	| LoadOrdersSuccessAction
	| LoadErrorAction
	| AddProductAction
	| AddProductSuccessAction
	| DeleteProductAction
	| DeleteProductSuccessAction
	| SelectOrderItemAction
	| DeselectOrderItemAction
	| MoveOrderItemAction
	| MoveOrderItemSuccessAction
	| LoadKitchenOrdersAction
	| LoadKitchenOrdersSuccessAction
	| IsOrderLoadingAction
	| IsOrderLoadingSuccessAction;
