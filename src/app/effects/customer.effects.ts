import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect ,ofType, createEffect} from '@ngrx/effects';

import { Observable} from 'rxjs/Observable';


import { Customer } from '../Model/customer.model';
import { BillingService } from '../Service/Billing/billing.service';

import * as customerActions from '../actions/customer.actions';
import { map,catchError,switchMap,mergeMap } from 'rxjs/operators';

// Custom Action
export class CAction implements Action {
	type: string;
	payload: any;
}

@Injectable()
export class CustomerEffects {
	
	// Constructor
	constructor(
		private api: BillingService,
		private actions$: Actions
	) {}

	@Effect()
	loadAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(customerActions.ActionTypes.LOAD),
		switchMap(() => this.api.loadCustomers().pipe(
			map(res => new customerActions.LoadCompletedAction({'customers': res})),
			catchError(() => Observable.of({ 'type': customerActions.ActionTypes.LOAD_ERROR }))
		))));
}
