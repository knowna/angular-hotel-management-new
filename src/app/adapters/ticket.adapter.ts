import { EntityState, createEntityAdapter }     from '@ngrx/entity';
import { Ticket }                                from '../Model/ticket.model';

// Entity adapter
export const TicketAdapter = createEntityAdapter<Ticket>({
    selectId: (ticket: Ticket) => ticket.Id,
    sortComparer: false
});

export interface State extends EntityState<Ticket> {
    CurrentTicketId?: string;
    TicketMessage?: string;
    IsTicketsLoading?: boolean;
}

export const InitialState: State = TicketAdapter.getInitialState({
    CurrentTicketId: "",
    TicketMessage: "",
    IsTicketsLoading: false
});