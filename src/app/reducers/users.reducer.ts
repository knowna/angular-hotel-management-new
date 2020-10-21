import { Action, ActionReducer }				from '@ngrx/store';
import { User }                                from '../Model/user.model';
import { UserAction, ActionTypes }             from '../actions/user.actions';

export function UsersReducer (state: User, action: UserAction) {
	switch (action.type) {

		case ActionTypes.LOAD_COMPLETED:
			return state = action.payload.user;

		default:
			return state;
	}
}