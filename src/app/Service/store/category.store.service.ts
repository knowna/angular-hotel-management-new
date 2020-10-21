import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Category } from '../../Model/category.model';
import { Observable } from 'rxjs/Observable';

import * as actions from '../../actions/category.actions';

@Injectable()
export class CategoryStoreService {
	categories$: Observable<Category[]>;

	// Dispatch load all categories event
	constructor (private store: Store<any>) {
		store.dispatch(new actions.LoadCategoriesAction());
	}
}