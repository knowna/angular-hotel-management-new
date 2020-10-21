import { Action } from '@ngrx/store';
import { Customer } from '../Model/customer.model';

// Customer Action Types defination
export const ActionTypes = {
    // Loading Customers
    LOAD: '[Customer] -> Load (requested)',
    LOAD_COMPLETED: '[Customer] -> Load (completed)',
    LOAD_ERROR: '[Customer] -> Load (error)',
    SET_CURRENT_CUSTOMER: '[Customer] -> Set current Customer (error)'
}

// Customer Actions defination
// Load payload for single customer
export class CustomerPayLoad {
    constructor(public customer: Customer) { }
}

// Load payload for all customers
export class CustomersPayLoad {
    constructor(public customers: Customer[]) { }
}

// Load ---------------------------------------------
// Load action for customer
export class LoadAction implements Action {
    // Variables
    type = ActionTypes.LOAD;
    ' '
    // Constructor
    constructor(public payload: any = null) { }
}

// On successful load of customers
export class LoadCompletedAction implements Action {
    // Variables
    type = ActionTypes.LOAD_COMPLETED;
   
    // Constructor
    constructor(public payload: CustomersPayLoad) { }
}

// On unsuccessful load of customers
export class LoadErrorAction implements Action {
    // Variables
    type = ActionTypes.LOAD_ERROR;
    ' '
    // Constructor
    constructor(public payload: string) { }
}

// On unsuccessful load of customers
export class SetCurrentCustomerIdAction implements Action {
    // Variables
    type = ActionTypes.SET_CURRENT_CUSTOMER;

    // Constructor
    constructor(public payload: any) { }
}

// Export Customer(s) Actions
export type CustomerAction
    = LoadAction
    | LoadCompletedAction
    | LoadErrorAction
    | SetCurrentCustomerIdAction;
