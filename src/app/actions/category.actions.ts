import { Action }			from '@ngrx/store';
import { Category }			from '../Model/category.model';

// Category Action Types defination
export const ActionTypes = {
	// Loading Categories
	LOAD_CATEGORIES:			'[Category] -> Load (requested)',
	LOAD_CATEGORIES_SUCCESS:  	'[Category] -> Load (success)',
	LOAD_ERROR:		 			'[Category] -> Load (error)'
}

// Category Actions defination
// Load payload for single category
export class CategoryPayLoad {
	constructor (public category: Category) {}
}

// Load payload for all categories
export class CategoriesPayLoad {
	constructor (public categories: Category[]) {}
}

// Load ---------------------------------------------
// Load action for category
export class LoadCategoriesAction implements Action {
	// Variables
	readonly type = ActionTypes.LOAD_CATEGORIES;

	// Constructor
	constructor (public payload: any = null) {}
}

// On successful load of categories
export class LoadCategoriesSuccessAction implements Action {
	// Variables
	readonly type = ActionTypes.LOAD_CATEGORIES_SUCCESS;

	// Constructor
	constructor (public payload: CategoriesPayLoad) {}
}

// On unsuccessful load of categories
export class LoadErrorAction implements Action {
	// Variables
	readonly type = ActionTypes.LOAD_ERROR;

	// Constructor
	constructor (public payload: string) {}
}

// Export Category(s) Actions
export type CategoryAction 
	= LoadCategoriesAction 
	| LoadCategoriesSuccessAction 
	| LoadErrorAction;






