import { Action, ActionReducer }				from '@ngrx/store';
import { Category }                               from '../Model/category.model';
import { CategoryAction, ActionTypes }            from '../actions/category.actions';
import { State, CategoryAdapter, InitialState } 	from '../adapters/category.adapter';

export function CategoriesReducer (state: State = InitialState, 
	action: CategoryAction) {

	switch (action.type){
		
		case ActionTypes.LOAD_CATEGORIES_SUCCESS:

			
			
			return { ...state, ...CategoryAdapter.addAll(action.payload.categories as Category[], state)};

		default:
			return state;
	}
}