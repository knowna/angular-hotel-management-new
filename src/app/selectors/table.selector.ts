import { createFeatureSelector, createSelector }     from '@ngrx/store';
import { TableAdapter, State }                       from '../adapters/table.adapter';

export const getTableState = createFeatureSelector<State>('tables');

export const {
    selectAll: getAllTables,
    selectEntities: getTableEntities
} = TableAdapter.getSelectors(getTableState);
  
export const getTablesState = createSelector(
    getTableState,
    state => state
);
  
export const getCurrentTableId = createSelector(
    getTablesState,
    (state: State) => state.CurrentTableId
);
  
export const getCurrentTable = createSelector(
    getTableEntities,
    getCurrentTableId,
    (entities, id) => id && entities[id]
);

