import { createFeatureSelector, createSelector }     from '@ngrx/store';
import { TicketAdapter, State }                       from '../adapters/ticket.adapter';

export const getTicketState = createFeatureSelector<State>('tickets');

export const {
    selectAll: getAllTickets,
    selectEntities: getTicketEntities
} = TicketAdapter.getSelectors(getTicketState);
  
export const getTicketsState = createSelector(
    getTicketState,
    state => state
);
  
export const getCurrentTicketId = createSelector(
    getTicketsState,
    (state: State) => state.CurrentTicketId
);

export const getTicketMessage = createSelector(
    getTicketsState,
    (state: State) => state.TicketMessage
);
  
export const getCurrentTicket = createSelector(
    getTicketEntities,
    getCurrentTicketId,
    (entities, id) => id && entities[id]
);

export const getLoadingStatus = createSelector(
    getTicketsState,
    (state: State) => state.IsTicketsLoading
);
