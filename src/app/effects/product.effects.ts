import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect,ofType, createEffect } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import { map,catchError,switchMap,mergeMap } from 'rxjs/operators';
import { Product } from '../Model/product.model';
import { BillingService } from '../Service/Billing/billing.service';

import * as productActions from '../actions/product.actions';

@Injectable()
export class ProductEffects {
	
	// Constructor
	constructor(
		private api: BillingService,
		private actions$: Actions
	) {}

	@Effect()
	loadAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(productActions.ActionTypes.LOAD_PRODUCTS),
		switchMap(() => this.api.loadProducts().pipe(
			map(res => new productActions.LoadProductsSuccessAction({'products': res})),
			catchError(() => Observable.of({ 'type': productActions.ActionTypes.LOAD_ERROR }))
		))));
}
