import { Action }			from '@ngrx/store';
import { Update } 			from '@ngrx/entity';
import { Table }			from '../Model/table.model';

// Table Action Types defination
export const ActionTypes = {
	// Loading Tables
	LOAD_ALL:			 	'[Table] -> Load All (requested)',
	LOAD:			 		'[Table] -> Load One (requested)',
	LOAD_SUCCESS:  	    	'[Table] -> Load (success)',
	LOAD_ALL_SUCCESS:  		'[Table] -> Load All (success)',
	LOAD_ERROR:		 		'[Table] -> Load (error)',
	CREATE_SUCCESS:			'[Table] -> Create (Success)',
	PATCH:					'[Table] -> Patch (requested)',
	PATCH_SUCCESS:			'[Table] -> Patch (Success)',
	DELETE:			        '[Table] -> Delete (requested)',	
	DELETE_SUCCESS: 		'[Table] -> Delete (Success)',
	SET_CURRENT_TABLE_ID:   '[Table] -> Set Current Table Id'
}

// Table Actions defination
// For single table
export class TablePayLoad {
	constructor (public table: Table) {}
}

// For many tables
export class TablesPayLoad {
	constructor (public tables: Table[]) {}
}

// Load action for tables
export class LoadAllAction {
	// Variables
	type = ActionTypes.LOAD_ALL;

	// Constructor
	constructor (public payload: any = null) {}
}

// Load action for tables
export class LoadAction implements Action {
	// Variables
	type = ActionTypes.LOAD;

	// Constructor
	constructor (public payload: any = null) {}
}

export class PatchAction implements Action {
	readonly type = ActionTypes.PATCH;
	constructor(public payload: Table) {}
}

export class DeleteAction implements Action {
	readonly type = ActionTypes.DELETE;
	constructor(public payload: string) {}
}

// On successful load of tables
export class LoadAllSuccessAction implements Action {
	// Variables
	type = ActionTypes.LOAD_ALL_SUCCESS;

	// Constructor
	constructor (public payload: TablesPayLoad) {}
}

// On successful load of tables
export class LoadSuccessAction implements Action {
	// Variables
	type = ActionTypes.LOAD_SUCCESS;

	// Constructor
	constructor (public payload: TablePayLoad) {}
}

// On unsuccessful load of tables
export class LoadErrorAction implements Action {
	// Variables
	type = ActionTypes.LOAD_ERROR;

	// Constructor
	constructor (public payload: string) {}
}

// Update Table
export class PatchSuccessAction implements Action {
	readonly type = ActionTypes.PATCH_SUCCESS;
	constructor(public payload: Update<Table>) {}
}
  
// Delete Table
export class DeleteSuccessAction implements Action {
	readonly type = ActionTypes.DELETE_SUCCESS;
	constructor(public payload: string) {}
}

// On selecting table
export class SetCurrentTableIdAction implements Action {
	// Variables
	type = ActionTypes.SET_CURRENT_TABLE_ID;

	// Constructor
	constructor (public payload: string) {}
}

// Export Table(s) Actions
export type TableAction 
	= LoadAction 
	| LoadAllSuccessAction
	| LoadSuccessAction 
	| LoadErrorAction
	| PatchAction
	| PatchSuccessAction
	| DeleteAction
	| DeleteSuccessAction
	| SetCurrentTableIdAction;






