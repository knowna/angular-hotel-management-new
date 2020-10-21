// Main dependencies
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { Global } from '../../Shared/global';

// Model
import { Ticket, PaymentSettle } from '../../Model/ticket.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TicketService {
	// Constructor
	constructor(private http: HttpClient) { }

	// Load Table Tickets
	loadTableTickets(tableId: string): Observable<Ticket[]> {
		// Call to API here
        return this.http.get<Ticket[]>(Global.BASE_SCREENTableTicket_ENDPOINT + "?TableId=" + tableId)
            
	}

	
    loadCustomerTickets(customerId:string):Observable<Ticket[]>{
        return this.http.get<Ticket[]>(Global.BASE_SCREENCustomerTicket_ENDPOINT  + "?CustomerId=" + customerId)
    }
    handleError(error:HttpErrorResponse){
        return throwError(error.error);
    }

	// Parse into Json
	getBody(data: any) {
		return JSON.stringify(data);
    }

	/**
	 * Calls the api to create a new ticket on the current table 
	 */
    createNewTicket(data: any) {
        // Call to API here
        return this.http.get('/db.new.json')
            .map((res: Response) => {
                return res.json()['tickets'][0];
            });
    }

    /**
     * Pay by cash
     * @param ticketId 
     * @param payDetails 
     */
    payTicketByCash(ticketId: number, payDetails: PaymentSettle) {
        // Call to API here
        return this.http.post(Global.BASE_POSSETTLEPAYMENT_ENDPOINT, payDetails)
            
    }

    /**
     * Pay by card
     * @param ticketId 
     * @param payDetails 
     */
    payTicketByCard(ticketId: number, payDetails: PaymentSettle) {
        // Call to API here
        return this.http.post(Global.BASE_POSSETTLEPAYMENT_ENDPOINT, payDetails)
           
    }

    /**
     * Pay by voucher
     * @param ticketId 
     * @param payDetails 
     */
    payTicketByVoucher(ticketId: number, payDetails: PaymentSettle) {
        // Call to API here
        return this.http.post(Global.BASE_POSSETTLEPAYMENT_ENDPOINT, payDetails)
          
    }
    
    /**
     * Pay by customer account
     * @param ticketId 
     * @param payDetails 
     */
    payTicketByCustomerAccount(ticketId: number, payDetails: PaymentSettle) {
        // Call to API here
        return this.http.post(Global.BASE_POSSETTLEPAYMENT_ENDPOINT, payDetails)
           
    }

    /**
     * Round off ticket
     * @param ticketId 
     * @param payDetails 
     */
    roundOffTicket(ticketId: number, payDetails: PaymentSettle) {
        // Call to API here
        return this.http.post(Global.BASE_POSSETTLEPAYMENT_ENDPOINT, payDetails)
           
    }

    /**
     * Add ticket note
     * @param ticketId 
     * @param note 
     */
    addTicketNote(ticketId: number, note: string) {
        // Call to API here
        return this.http.get(Global.BASE_TicketNote_ENDPOINT+ "?TicketId=" +ticketId+"&Note="+note)
           
    }

    /**
     * Print Bill
     * @param ticketId 
     * @param payDetails 
     */
    printBill(ticketId: number) {
        // Call to API here
        return this.http.get(Global.BASE_TicketPrint_ENDPOINT  + "?TicketId=" + ticketId)
            
    }

    /**
     * Add Discount on ticket
     * @param payDetails 
     */
    addDiscount(payDetails: PaymentSettle) {
        // Call to API here
        return this.http.post(Global.BASE_POSSETTLEPAYMENT_ENDPOINT, payDetails)
           
    }
}
