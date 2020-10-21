import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect,ofType, createEffect} from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';


import { map,catchError,switchMap,mergeMap } from 'rxjs/operators';
import { User } from '../Model/user.model';
import { BillingService } from '../Service/Billing/billing.service';

import * as userActions from '../actions/user.actions';


// Custom Action
export class CAction implements Action {
	type: string;
	payload: any;
}

@Injectable()
export class UserEffects {
	
	// Constructor
	constructor(
		private api: BillingService,
		private actions$: Actions
	) {}

	@Effect()
	loadAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(userActions.ActionTypes.LOAD),
		switchMap(() => this.api.loadUser().pipe(
			map(res => new userActions.LoadCompletedAction({'user': res})),
			catchError(() => Observable.of({ 'type': userActions.ActionTypes.LOAD_ERROR }))
		))));
}
