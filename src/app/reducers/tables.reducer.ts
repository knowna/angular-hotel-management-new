import { Action, ActionReducer } 				from '@ngrx/store';
import { Update } 							 	from '@ngrx/entity';
import { Table } 								from '../Model/table.model';
import { TableAction, ActionTypes } 			from '../actions/table.actions';
import { State, TableAdapter, InitialState } 	from '../adapters/table.adapter';

export function TablesReducer(state = InitialState, action: TableAction) {
	switch (action.type) {
		case ActionTypes.SET_CURRENT_TABLE_ID: {
			return { ...state, CurrentTableId: action.payload }
		}

		case ActionTypes.LOAD_ALL_SUCCESS: {
			return { ...state, ...TableAdapter.addAll(action.payload.tables as Table[], state) }
		}

		case ActionTypes.LOAD_SUCCESS || ActionTypes.CREATE_SUCCESS: {
			return { ...state, ...TableAdapter.addOne(action.payload.table as Table, state) }
		}

		case ActionTypes.PATCH_SUCCESS: {
			return { ...state, ...TableAdapter.updateOne(action.payload.table as Update<Table>, state)}
		}

		case ActionTypes.DELETE_SUCCESS: {
			return { ...state, ...TableAdapter.removeOne(action.payload.tableId as number, state) }
		}

		default:
			return state;
	}
}