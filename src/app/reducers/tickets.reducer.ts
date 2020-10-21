import { Action, ActionReducer } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Ticket } from '../Model/ticket.model';
import { TicketAction, ActionTypes } from '../actions/ticket.actions';
import { State, TicketAdapter, InitialState } from '../adapters/ticket.adapter';

export function TicketsReducer(state: State = InitialState, action: TicketAction) {
    switch (action.type) {

        case ActionTypes.CREATE_NEW_TICKET_SUCCESS: {
            return { ...state, ...TicketAdapter.addOne(action.payload.ticket as Ticket, state) }
        }

        case ActionTypes.SET_CURRENT_TICKET_ID: {
            return { ...state, CurrentTicketId: action.payload ? action.payload : '' }
        }

        case ActionTypes.CLEAR_TICKETS: {
            return TicketAdapter.removeAll({ ...state, CurrentTicketId: null });
        }

        case ActionTypes.LOAD_TABLE_TICKETS_SUCCESS:
        case ActionTypes.LOAD_CUSTOMER_TICKETS_SUCCESS:
            return { ...state, ...TicketAdapter.addAll(action.payload.tickets as Ticket[], state) };

        case ActionTypes.ADD_TICKET_MESSAGE_SUCCESS:
            alert("Ticket was created successfully!");
            return state;

        case ActionTypes.ADD_TICKET_PAYMENT_MESSAGE_SUCCESS:
            alert("Ticket was settled and payment is made successfully!");
            return state;

        case ActionTypes.PAY_BY_CASH_SUCCESS:
        case ActionTypes.PAY_BY_CARD_SUCCESS:
        case ActionTypes.PAY_BY_VOUCHER_SUCCESS:
        case ActionTypes.PAY_BY_CUSTOMER_ACCOUNT_SUCCESS:
            return { ...state, ...TicketAdapter.updateOne(action.payload as Update<Ticket>, state)};
        
        case ActionTypes.ROUND_OFF_TICKET_SUCCESS:
        case ActionTypes.ADD_TICKET_NOTE_SUCCESS:
        case ActionTypes.PRINT_BILL_SUCCESS:
        case ActionTypes.ADD_DISCOUNT_SUCCESS:
            return { ...state, ...TicketAdapter.updateOne(action.payload as Update<Ticket>, state)};

        case ActionTypes.IS_TICKET_LOADING:
            state.IsTicketsLoading = true;
            
            return {...state};

        case ActionTypes.IS_TICKET_LOADING_SUCCESS:
            state.IsTicketsLoading = false;

            return {...state};

        default:
            return state;
    }
}
