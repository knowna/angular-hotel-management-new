import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect,ofType, createEffect } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';

import { BillingService } from '../Service/Billing/billing.service';

import * as categoryActions from '../actions/category.actions';
import { map,catchError,switchMap ,mergeMap} from 'rxjs/operators';

@Injectable()
export class CategoryEffects {
	
	// Constructor
	constructor(
		private api: BillingService,
		private actions$: Actions
	) {}

	@Effect()
	loadAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(categoryActions.ActionTypes.LOAD_CATEGORIES),
		switchMap(() => this.api.loadCategories().pipe(
			map(res => new categoryActions.LoadCategoriesSuccessAction({'categories': res})),
			catchError(() => Observable.of({ 'type': categoryActions.ActionTypes.LOAD_ERROR }))
		))));
}
