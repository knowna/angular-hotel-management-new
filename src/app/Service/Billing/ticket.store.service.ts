import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Ticket, PaymentSettle } from '../../Model/ticket.model';
import { Observable } from 'rxjs/Observable';

import * as actions from '../../actions/ticket.actions';

@Injectable(
	{providedIn:'root'}
)
export class TicketStoreService {
    tickets$: Observable<Ticket[]>;

    // Dispatch load all tickets event
    constructor(private store: Store<any>) { }

	/**
	 * Loads tickets for given table
	 * @param tableId 
	 */
    loadTicketsByTable(tableId: string) {
		this.store.dispatch(new actions.IsTicketLoadingAction());
        this.store.dispatch(new actions.LoadTableTicketsAction(tableId));
    }

	/**
	 * Loads tickets by customer
	 * @param customerId 
	 */
    loadTicketsByCustomer(customerId: number) {
		this.store.dispatch(new actions.IsTicketLoadingAction());
        this.store.dispatch(new actions.LoadCustomerTicketsAction(customerId));
	}
	
	/**
	 * Clear All Tickets
	 */
	clearAllTickets() {
		this.store.dispatch(new actions.ClearAllTickets());
	}

	/**
	 * Sets Current Ticket Id in State
	 * @param ticketId 
	 */
    setCurrentTicket(ticketId: number) {
        this.store.dispatch(new actions.SetCurrentTicketAction(ticketId));
    }

	/**
	 * Create a new ticket on the current table
	 * @param data 
	 */
    createNewTicket(data: any) {
        this.store.dispatch(new actions.CreateTableTicketAction({ "tableId": data.tableId, "customerId": data.customerId }));
    }

	/**
	 * Add a new ticket note on the given ticket
	 * @param ticketId 
	 * @param note 
	 * 
	 */
    addTicketNote(ticketId: number, note: string) {
        this.store.dispatch(new actions.AddTicketNoteAction({ "ticketId": ticketId, "note": note }));
    }

	/**
	 * Pay ticket by cash
	 * @param ticketId 
	 * @param details 
	 */
    payByCash(ticketId: number, details: PaymentSettle) {
		this.store.dispatch(new actions.IsTicketLoadingAction());		
        this.store.dispatch(new actions.PayTicketByCashAction({ "ticketId": ticketId, "details": details }));
    }

	/**
	 * Pay ticket by card
	 * @param ticketId 
	 * @param details 
	 */
    payByCard(ticketId: number, details: PaymentSettle) {
		this.store.dispatch(new actions.IsTicketLoadingAction());		
        this.store.dispatch(new actions.PayTicketByCardAction({ "ticketId": ticketId, "details": details }));
    }

	/**
	 * Pay ticket by voucher
	 * @param ticketId 
	 * @param details 
	 */
    payByVoucher(ticketId: number, details: PaymentSettle) {
		this.store.dispatch(new actions.IsTicketLoadingAction());				
        this.store.dispatch(new actions.PayTicketByVoucherAction({ "ticketId": ticketId, "details": details }));
    }

	/**
	 * Pay ticket by Customer Account
	 * @param ticketId 
	 * @param details 
	 */
    payCustomerAccount(ticketId: number, details: PaymentSettle) {
		this.store.dispatch(new actions.IsTicketLoadingAction());				
        this.store.dispatch(new actions.PayTicketByCustomerAccountAction({ "ticketId": ticketId, "details": details }));
    }

	/**
	 * Make the ticket values round offed
	 * @param ticketId 
	 * @param details 
	 */
    roundTicket(ticketId: number, details: PaymentSettle) {
        this.store.dispatch(new actions.RoundOffTicketAction({ "ticketId": ticketId, "details": details }));
    }


	/**
	 * Make the ticket locked form backend
	 * @param ticketId 
	 * @param details 
	 */
    printBill(ticketId: number) {
        this.store.dispatch(new actions.PrintBillAction({ "ticketId": ticketId }));
	}
	
	/**
	 * Add the ticket discount to backend
	 * @param ticketDetails 
	 */
    addDiscount(ticketDetails: any) {
		this.store.dispatch(new actions.IsTicketLoadingAction());				
        this.store.dispatch(new actions.AddTicketDiscountAction({ "ticketDetails": ticketDetails }));
    }
}