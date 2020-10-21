import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '../../Model/product.model';
import { Observable } from 'rxjs/Observable';

import * as actions from '../../actions/product.actions';

@Injectable()
export class ProductStoreService {
	products$: Observable<Product[]>;

	// Dispatch load all products event
	constructor (private store: Store<any>) {
		store.dispatch(new actions.LoadProductsAction());
	}
}