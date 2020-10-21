import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Table } from '../../Model/table.model';

import * as actions from '../../actions/table.actions';

@Injectable()
export class TableStoreService {
	tables$: Observable<Table[]>;

	// Dispatch load all tables event
	constructor (private store: Store<any>) {
		this.store.dispatch(new actions.LoadAllAction());
	}

	loadAllTables () {
		this.store.dispatch(new actions.LoadAllAction());
	}

	// Set currently selected table to be given table ID
	setCurrentTable (table: Table) {
		this.store.dispatch(new actions.SetCurrentTableIdAction(table.TableId));
	}
}