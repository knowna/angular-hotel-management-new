import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect,ofType, createEffect } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import { map,catchError,switchMap,mergeMap } from 'rxjs/operators';
import { Table } from '../Model/table.model';


import * as tableActions from '../actions/table.actions';
import { BillingService } from '../Service/Billing/billing.service';

// Custom Action
export class CAction implements Action {
	type: string;
	payload: any;
}

@Injectable()
export class TableEffects {

	// Constructor
	constructor(
		private api: BillingService,
		private actions$: Actions
	) { }

	@Effect()
	loadAllAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(tableActions.ActionTypes.LOAD_ALL),
		switchMap(() => this.api.loadTables().pipe(
			map(res => new tableActions.LoadAllSuccessAction({ 'tables': res })),
			catchError(() => Observable.of({ 'type': tableActions.ActionTypes.LOAD_ERROR }))
		))));

	@Effect()
	loadAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(tableActions.ActionTypes.LOAD),
		map((action: tableActions.LoadAction) => action.payload),
		switchMap((id) => 
			this.api.show(id)
			.mergeMap((table: Table) => {
				return [
					new tableActions.LoadSuccessAction({'table': table}),
					new tableActions.SetCurrentTableIdAction(table.TableId)
				]
			})
		)));

	@Effect()
	UpdateAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(tableActions.ActionTypes.PATCH),
		map((action: tableActions.PatchAction) => action.payload),
		switchMap((table: Table) =>
			this.api.update(table).pipe(
				map((updatedTable: Table) => new tableActions.PatchSuccessAction({ 
					id: updatedTable.TableId, changes: updatedTable 
				})),
				catchError(err => {
					alert(err['error']['error']['message']);
					return Observable.of(new tableActions.LoadErrorAction('Updating error'));
				})
		))));

	@Effect()
	DestroyAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(tableActions.ActionTypes.DELETE),
		map((action: tableActions.DeleteAction) => action.payload),
		switchMap((id: string) =>
			this.api.destroy(id).pipe(
				map(() => new tableActions.DeleteSuccessAction(id))
	))));
}
