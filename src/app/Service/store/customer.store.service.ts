import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Customer } from '../../Model/customer.model';
import { Observable } from 'rxjs/Observable';

import * as actions from '../../actions/customer.actions';

@Injectable()
export class CustomerStoreService {
	customers$: Observable<Customer[]>;

	// Dispatch load all customers event
	constructor (private store: Store<any>) {
		this.customers$ = store.select('customers') as Observable<Customer[]>;
		store.dispatch(new actions.LoadAction());
	}

	
	// Set currently selected customer to be given table ID
    setCurrentCustomer(customer: Customer) {
		this.store.dispatch(new actions.SetCurrentCustomerIdAction(customer.Id));
	}
	
}