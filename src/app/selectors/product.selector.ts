import { createFeatureSelector, createSelector }     from '@ngrx/store';
import { ProductAdapter, State }                       from '../adapters/product.adapter';

export const getProductState = createFeatureSelector<State>('products');

export const {
    selectAll: getAllProducts,
    selectEntities: getProductEntities
} = ProductAdapter.getSelectors(getProductState);
  
export const getProductsState = createSelector(
    getProductState,
    state => state
);

