import { Action }			from '@ngrx/store';
import { Product }			from '../Model/product.model';

// Product Action Types defination
export const ActionTypes = {
	// Loading Products
	LOAD_PRODUCTS:			 	'[Product] -> Load (requested)',
	LOAD_PRODUCTS_SUCCESS:  	'[Product] -> Load (completed)',
	LOAD_ERROR:		 			'[Product] -> Load (error)'
}

// Product Actions defination
// Load payload for single product
export class ProductPayLoad {
	constructor (public product: Product) {}
}

// Load payload for all products
export class ProductsPayLoad {
	constructor (public products: Product[]) {}
}

// Load ---------------------------------------------
// Load action for products
export class LoadProductsAction implements Action {
	// Variables
	type = ActionTypes.LOAD_PRODUCTS;

	// Constructor
	constructor (public payload: any = null) {}
}

// On successful load of products
export class LoadProductsSuccessAction implements Action {
	// Variables
	type = ActionTypes.LOAD_PRODUCTS_SUCCESS;

	// Constructor
	constructor (public payload: ProductsPayLoad) {}
}

// On unsuccessful load of products
export class LoadErrorAction implements Action {
	// Variables
	type = ActionTypes.LOAD_ERROR;

	// Constructor
	constructor (public payload: string) {}
}

// Export Product(s) Actions
export type ProductAction 
	= LoadProductsAction 
	| LoadProductsSuccessAction 
	| LoadErrorAction;






