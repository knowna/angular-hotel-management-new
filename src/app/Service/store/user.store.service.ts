import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '../../Model/user.model';
import { Observable } from 'rxjs/Observable';

import * as actions from '../../actions/user.actions';

@Injectable()
export class UserStoreService {
	user$: Observable<User>;

	// Dispatch load all users event
	constructor (private store: Store<any>) {
		this.user$ = store.select('user') as Observable<User>;
		store.dispatch(new actions.LoadAction());
	}
}