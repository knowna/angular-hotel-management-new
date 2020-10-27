import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { Ticket } from '../../../../Model/ticket.model';
import { Table } from '../../../../Model/table.model';

// Selectors
import * as TicketSelector from '../../../../selectors/ticket.selector';
import * as CustomerSelector from '../../../../selectors/customer.selector';

// Store Services
import { TicketStoreService } from '../../../../Service/store/ticket.store.service';

@Component({
    selector: 'pos-tickets',
    templateUrl: './pos-tickets.component.html',
    styleUrls: ['./pos-tickets.component.css']
})
export class PosTicketsComponent {
    @Input('table') table: Table;
    @Input('toOpenTicketId') toOpenTicketId: number;

    isTicketEmpty: boolean;
    tickets: Ticket[] = [];
    tableId: string;
    customerId: number;
    customer$: Observable<any>;

    // Constructor
    constructor(
        private store: Store<any>,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private ticketStoreService: TicketStoreService,
    ) {
        this.activatedRoute.params.subscribe(params => {
            this.tableId = params['tableId'] || '';
            this.customerId = params['customerId'] || '';

            let currentUrl = this.router.url;
            let emptyTicketIndex = currentUrl.indexOf('empty-ticket');
    
            if (emptyTicketIndex !== -1) {
                this.isTicketEmpty = true;
            } else {
                this.tableId ? this.ticketStoreService.loadTicketsByTable(this.tableId) : '';
                this.customerId ? this.ticketStoreService.loadTicketsByCustomer(this.customerId) : '';
            }
        });
    }

    // Initialize data here
    ngOnInit() {
        this.customer$ = this.store.select(CustomerSelector.getCurrentCustomer);   
        this.store.select(TicketSelector.getAllTickets)
            .subscribe((tickets: Ticket[]) => {
                
                if (this.router.url == "/pos/settle") {
                    return false;
                }
                
                this.tickets = tickets || [];
                if (this.tickets.length === 1) {
                    (this.tableId) && this.goToTableTicketDetailView(this.tickets[0].Id);
                    (this.customerId) && this.goToCustomerTicketDetailView(this.tickets[0].Id);
                    return true;
                }
                
                if (this.router.url.indexOf('move') !== -1) {
                    this.toOpenTicketId && this.tickets.forEach((ticket: Ticket) => {
                        if(ticket.Id == this.toOpenTicketId) {
                            (this.tableId) && this.goToTableTicketDetailView(ticket.Id);
                            (this.customerId) && this.goToCustomerTicketDetailView(ticket.Id);
                        }
                    });
                }
            });
    }

    // Load the ticket detail view
    loadDetailView(ticketId: number, customerId: number) {
        this.tableId && this.goToTableTicketDetailView(ticketId);
        this.customerId && this.goToCustomerTicketDetailView(ticketId);
    }

    // Redirects to Tickets list view
    goToTableTicketDetailView(ticketId: number) {
        if (!ticketId) {
            return false;
        }

       this.router.navigate(['/table/' + this.tableId + '/ticket/' + ticketId]);
    }

    // Redirects to Tickets list view
    goToCustomerTicketDetailView(ticketId: any) {
        
        if (!ticketId) {
            return false;
        }
        
        this.router.navigate(['/customer/' + this.customerId + '/ticket/' + ticketId]);
    }
}
