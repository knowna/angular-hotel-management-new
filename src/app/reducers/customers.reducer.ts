import { Action, ActionReducer } from '@ngrx/store';
import { Customer } from '../Model/customer.model';
import { CustomerAction, ActionTypes } from '../actions/customer.actions';
import { State, CustomerAdapter, InitialState } from '../adapters/customer.adapter';

export function CustomersReducer(state = InitialState, action: CustomerAction) {
    switch (action.type) {
        case ActionTypes.LOAD_COMPLETED:
            return { ...state, ...CustomerAdapter.addAll(action.payload.customers as Customer[], state) };

        case ActionTypes.SET_CURRENT_CUSTOMER:
            return { ...state, CurrentCustomerId: action.payload }

        default:
            return state;
    }
}
