import { EntityState, createEntityAdapter }     from '@ngrx/entity';
import { Order }                                from '../Model/order.model';

// Entity adapter
export const OrderAdapter = createEntityAdapter<Order>({
    selectId: (order: Order) => order.OrderNumber,
    sortComparer: false
});

export interface State extends EntityState<Order> {
    CurrentOrderId?: string;
    IsOrderLoading?: boolean;
}

export const InitialState: State = OrderAdapter.getInitialState({
    CurrentOrderId: "",
    IsOrderLoading: false
});