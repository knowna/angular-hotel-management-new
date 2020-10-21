import { createFeatureSelector, createSelector }     from '@ngrx/store';
import { CategoryAdapter, State }                    from '../adapters/category.adapter';

export const getCategoryState = createFeatureSelector<State>('categories');

export const {
    selectAll: getAllCategories,
    selectEntities: getCategoryEntities
} = CategoryAdapter.getSelectors(getCategoryState);
  
export const getCategorysState = createSelector(
    getCategoryState,
    state => state
);
