import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Ticket } from '../Model/ticket.model';

// Ticket Action Types defination
export const ActionTypes = {
    // Loading Tickets
    LOAD_TABLE_TICKETS: '[Ticket] -> Load Tickets (requested)',
    LOAD_TABLE_TICKETS_SUCCESS: '[Ticket] -> Load Tickets (completed)',
    LOAD_ERROR: '[Ticket] -> Load Tickets (error)',

    // Set current ticket Id
    SET_CURRENT_TICKET_ID: '[Ticket] -> Set Current Ticket Id',

    // Loading customer tickets
    LOAD_CUSTOMER_TICKETS: '[Customer] -> Load Customer Tickets (requested)',
    LOAD_CUSTOMER_TICKETS_SUCCESS: '[Customer] -> Load Customer Tickets (success)',

    CREATE_NEW_TICKET: '[Ticket] -> Create New ticket',
    CREATE_NEW_TICKET_SUCCESS: '[Ticket] -> Create new ticket success',

    PAY_BY_CASH: '[Ticket] -> Pay Ticket amount by cash',
    PAY_BY_CASH_SUCCESS: '[Ticket] -> Pay Ticket amount by cash success',

    PAY_BY_CARD: '[Ticket] -> Pay Ticket amount by Card',
    PAY_BY_CARD_SUCCESS: '[Ticket] -> Pay Ticket amount by Card success',

    PAY_BY_VOUCHER: '[Ticket] -> Pay Ticket amount by Voucher',
    PAY_BY_VOUCHER_SUCCESS: '[Ticket] -> Pay Ticket amount by Voucher success',

    PAY_BY_CUSTOMER_ACCOUNT: '[Ticket] -> Pay Ticket amount by Customer Account',
    PAY_BY_CUSTOMER_ACCOUNT_SUCCESS: '[Ticket] -> Pay Ticket amount by Customer Account success',

    ROUND_OFF_TICKET: '[Ticket] -> Round Off Ticket amount',
    ROUND_OFF_TICKET_SUCCESS: '[Ticket] -> Round OFF Ticket amount success',

    ADD_TICKET_NOTE: '[Ticket] -> Add ticket Note',
    ADD_TICKET_NOTE_SUCCESS: '[Ticket] -> Add ticket note success',

    ADD_TICKET_MESSAGE: '[Ticket] -> Add ticket message',
    ADD_TICKET_MESSAGE_SUCCESS: '[Ticket] -> Add ticket message success',

    ADD_TICKET_PAYMENT_MESSAGE_SUCCESS: '[Ticket] -> Add ticket payment message success',

    PRINT_BILL: '[Ticket] -> Add ticket Note',
    PRINT_BILL_SUCCESS: '[Ticket] -> Add ticket note success',

    ADD_DISCOUNT: '[Ticket] -> Add ticket discount',
    ADD_DISCOUNT_SUCCESS: '[Ticket] -> Add ticket discount',

    CLEAR_TICKETS: '[Ticket] -> Clear All Tickets',
    
	IS_TICKET_LOADING: 		'[Ticket Item] -> Is Ticket loading',
	IS_TICKET_LOADING_SUCCESS: 	'[Ticket Item] -> Is Ticket loading Success',
}

// Load payload for single ticket
export class TicketPayLoad {
    constructor(public ticket: Ticket) { }
}

// Load payload for all tickets
export class TicketsPayLoad {
    constructor(public tickets: Ticket[]) { }
}

// Load action for ticket
export class LoadTableTicketsAction implements Action {
    // Variables
    type = ActionTypes.LOAD_TABLE_TICKETS;

    // Constructor
    constructor(public payload: any = null) { }
}

// On successful load of tickets
export class LoadTableTicketsSuccessAction implements Action {
    // Variables
    type = ActionTypes.LOAD_TABLE_TICKETS_SUCCESS;

    // Constructor
    constructor(public payload: TicketsPayLoad) { }
}

export class LoadCustomerTicketsAction implements Action {
    // variables
    type = ActionTypes.LOAD_CUSTOMER_TICKETS;

    // Constructor
    constructor(public payload: any = null) { }
}

export class LoadCustomerTicketsSuccessAction implements Action {
    // variables
    type = ActionTypes.LOAD_CUSTOMER_TICKETS_SUCCESS;

    // Constructor
    constructor(public payload: any = null) { }
}

// On unsuccessful load of tickets
export class LoadErrorAction implements Action {
    // Variables
    type = ActionTypes.LOAD_ERROR;

    // Constructor
    constructor(public payload: string) { }
}

export class SetCurrentTicketAction implements Action {
    // Variables
    type = ActionTypes.SET_CURRENT_TICKET_ID;

    // Constructor
    constructor(public payload: number) { }
}

// Create New Table Ticket
export class CreateTableTicketAction implements Action {
    // Variables
    type = ActionTypes.CREATE_NEW_TICKET;

    // Constructor
    constructor(public payload: any = null) { }
}

// On successful creation of ticket
export class CreateTableTicketSuccessAction implements Action {
    // Variables
    type = ActionTypes.CREATE_NEW_TICKET_SUCCESS;

    // Constructor
    constructor(public payload: TicketPayLoad) { }
}

// Pay Ticket by cash
export class PayTicketByCashAction implements Action {
    // Variables
    type = ActionTypes.PAY_BY_CASH;

    // Constructor
    constructor(public payload: any = null) { }
}

// On successful payment by cash
export class PayTicketByCashSuccessAction implements Action {
    // Variables
    type = ActionTypes.PAY_BY_CASH_SUCCESS;

    // Constructor
    constructor(public payload: Update<Ticket>) { }
}

// Pay Ticket by card
export class PayTicketByCardAction implements Action {
    // Variables
    type = ActionTypes.PAY_BY_CARD;

    // Constructor
    constructor(public payload: any = null) { }
}

// On successful payment by card
export class PayTicketByCardSuccessAction implements Action {
    // Variables
    type = ActionTypes.PAY_BY_CARD_SUCCESS;

    // Constructor
    constructor(public payload: Update<Ticket>) { }
}

// Pay Ticket by voucher
export class PayTicketByVoucherAction implements Action {
    // Variables
    type = ActionTypes.PAY_BY_VOUCHER;

    // Constructor
    constructor(public payload: any = null) { }
}

// On successful payment by voucher
export class PayTicketByVoucherSuccessAction implements Action {
    // Variables
    type = ActionTypes.PAY_BY_VOUCHER_SUCCESS;

    // Constructor
    constructor(public payload: Update<Ticket>) { }
}

// Pay Ticket by Customer Account
export class PayTicketByCustomerAccountAction implements Action {
    // Variables
    type = ActionTypes.PAY_BY_CUSTOMER_ACCOUNT;

    // Constructor
    constructor(public payload: any = null) { }
}

// On successful payment by Customer Account
export class PayTicketByCustomerAccountSuccessAction implements Action {
    // Variables
    type = ActionTypes.PAY_BY_CUSTOMER_ACCOUNT_SUCCESS;

    // Constructor
    constructor(public payload: Update<Ticket>) { }
}

// Round Off Ticket
export class RoundOffTicketAction implements Action {
    // Variables
    type = ActionTypes.ROUND_OFF_TICKET;

    // Constructor
    constructor(public payload: any = null) { }
}

// On successful ticket round off
export class RoundOffTicketSuccessAction implements Action {
    // Variables
    type = ActionTypes.ROUND_OFF_TICKET_SUCCESS;

    // Constructor
    constructor(public payload: Update<Ticket>) { }
}

// Add Ticket Note
export class AddTicketNoteAction implements Action {
    // Variables
    type = ActionTypes.ADD_TICKET_NOTE;

    // Constructor
    constructor(public payload: any = null) { }
}

// Add Ticket Note
export class AddTicketMessageAction implements Action {
    // Variables
    type = ActionTypes.ADD_TICKET_MESSAGE;
    // Constructor
    constructor(public payload: any = null) { }
}

// On successful addition of ticket note
export class AddTicketMessageSuccessAction implements Action {
    // Variables
    type = ActionTypes.ADD_TICKET_MESSAGE_SUCCESS;

    // Constructor
    constructor(public payload: any = null) { }
}

// On successful addition of ticket note
export class AddTicketPaymentMessageSuccessAction implements Action {
    // Variables
    type = ActionTypes.ADD_TICKET_PAYMENT_MESSAGE_SUCCESS;

    // Constructor
    constructor(public payload: any = null) { }
}

// On successful addition of ticket note
export class AddTicketNoteSuccessAction implements Action {
    // Variables
    type = ActionTypes.ADD_TICKET_NOTE_SUCCESS;

    // Constructor
    constructor(public payload: TicketPayLoad) { }
}

// Add Ticket Note
export class PrintBillAction implements Action {
    // Variables
    type = ActionTypes.PRINT_BILL;

    // Constructor
    constructor(public payload: any = null) { }
}

// On successful addition of ticket note
export class PrintBillSuccessAction implements Action {
    // Variables
    type = ActionTypes.PRINT_BILL_SUCCESS;

    // Constructor
    constructor(public payload: TicketPayLoad) { }
}


// On successful addition of ticket note
export class ClearAllTickets implements Action {
    // Variables
    type = ActionTypes.CLEAR_TICKETS;

    // Constructor
    constructor(public payload: any = null) { }
}

export class AddTicketDiscountAction implements Action {
    // Variables
    type= ActionTypes.ADD_DISCOUNT;

    // Constructor
    constructor(public payload: any) {}
}

export class AddTicketDiscountSuccessAction implements Action {
    // Variables
    type= ActionTypes.ADD_DISCOUNT_SUCCESS;

    // Constructor
    constructor(public payload: Update<Ticket>) { }
}


export class IsTicketLoadingAction implements Action {
	// Variables
	type = ActionTypes.IS_TICKET_LOADING;

	// Constructor
	constructor(public payload: boolean = true) { }
}

export class IsTicketLoadingSuccessAction implements Action {
	// Variables
	type = ActionTypes.IS_TICKET_LOADING_SUCCESS;

	// Constructor
	constructor(public payload: boolean = false) { }
}

// Export Ticket(s) Actions
export type TicketAction
    = LoadTableTicketsAction
    | LoadTableTicketsSuccessAction
    | LoadErrorAction
    | SetCurrentTicketAction
    | LoadTableTicketsAction
    | LoadCustomerTicketsSuccessAction
    | CreateTableTicketAction
    | CreateTableTicketSuccessAction
    | PayTicketByCashAction
    | PayTicketByCashSuccessAction
    | PayTicketByCardAction
    | PayTicketByCardSuccessAction
    | PayTicketByVoucherAction
    | PayTicketByVoucherSuccessAction
    | PayTicketByCustomerAccountAction
    | PayTicketByCustomerAccountSuccessAction
    | RoundOffTicketAction
    | RoundOffTicketSuccessAction
    | AddTicketNoteAction
    | AddTicketNoteSuccessAction
    | PrintBillAction
    | PrintBillSuccessAction
    | ClearAllTickets
    | AddTicketDiscountAction
    | AddTicketDiscountSuccessAction
    | AddTicketMessageAction
    | AddTicketMessageSuccessAction
    | AddTicketPaymentMessageSuccessAction
    | IsTicketLoadingAction
    | IsTicketLoadingSuccessAction;

