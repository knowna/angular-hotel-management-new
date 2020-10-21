import { createFeatureSelector, createSelector }     from '@ngrx/store';
import { OrderAdapter, State }                       from '../adapters/order.adapter';

export const getOrderState = createFeatureSelector<State>('orders');

export const {
    selectAll: getAllOrders,
    selectEntities: getOrderEntities
} = OrderAdapter.getSelectors(getOrderState);
  
export const getOrdersState = createSelector(
    getOrderState,
    state => state
);
  
export const getCurrentOrderId = createSelector(
    getOrdersState,
    (state: State) => state.CurrentOrderId
);
  
export const getCurrentOrder = createSelector(
    getOrderEntities,
    getCurrentOrderId,
    (entities, id) => id && entities[id]
);

export const getLoadingStatus = createSelector(
    getOrdersState,
    (state: State) => state.IsOrderLoading
);




