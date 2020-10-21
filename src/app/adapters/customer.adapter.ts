import { EntityState, createEntityAdapter }     from '@ngrx/entity';
import { Customer }                             from '../Model/customer.model';

// Entity adapter
export const CustomerAdapter = createEntityAdapter<Customer>({
    selectId: (customer: Customer) => customer.Id,
    sortComparer: false
});

export interface State extends EntityState<Customer> {
    CurrentCustomerId?: number
}

export const InitialState: State = CustomerAdapter.getInitialState({
    CurrentCustomerId: 0
});