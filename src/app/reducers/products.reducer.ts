import { Action, ActionReducer }				from '@ngrx/store';
import { Product }                               from '../Model/product.model';
import { ProductAction, ActionTypes }            from '../actions/product.actions';
import { State, ProductAdapter, InitialState } 	from '../adapters/product.adapter';

export function ProductsReducer (state: State = InitialState, action: ProductAction) {

	switch (action.type) {

        case ActionTypes.LOAD_PRODUCTS_SUCCESS:
			return { ...state, ...ProductAdapter.addAll(action.payload.products as Product[], state)};

		default:
			return state;
	}
}