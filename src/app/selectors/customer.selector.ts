import { createFeatureSelector, createSelector }     from '@ngrx/store';
import { CustomerAdapter, State }                    from '../adapters/customer.adapter';

export const getCustomerState = createFeatureSelector<State>('customers');

export const {
    selectAll: getAllCustomers,
    selectEntities: getCustomerEntities
} = CustomerAdapter.getSelectors(getCustomerState);
  
export const getCustomersState = createSelector(
    getCustomerState,
    state => state
);
  
export const getCurrentCustomerId = createSelector(
    getCustomersState,
    (state: State) => state.CurrentCustomerId
);
  
export const getCurrentCustomer = createSelector(
    getCustomerEntities,
    getCurrentCustomerId,
    (entities, id) => id && entities[id]
);

