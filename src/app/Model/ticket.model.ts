import { OrderItemRequest } from './order.model';

/**	
 * Defines the model/interface for Ticket entity
 */
export class Ticket {
    Id?: number;
    Name?: string;
    TableId?: string;
    TicketId?: string;
    CustomerId?: number;
    TicketOpeningTime?: number;
    isSubmitted?: boolean;
    IsActive?: boolean;
    Discount?: number;
    PaymentHistory?: PaymentHistory[];
    TotalAmount?: number;
    Note?: string;

    constructor(ticket: any) {
        this.Id = ticket.Id;
        this.Name = ticket.Name;
        this.TableId = ticket.TableId;
        this.TicketId = ticket.TicketId;
        this.CustomerId = ticket.CustomerId;
        this.TicketOpeningTime = ticket.TicketOpeningTime;
        this.isSubmitted = ticket.isSubmitted;
        this.IsActive = ticket.IsActive;
        this.Discount = ticket.Discount;
        this.PaymentHistory = ticket.PaymentHistory;
        this.TotalAmount = ticket.TotalAmount;
        this.Note = ticket.note;
    }
}

export class TicketNote {
    TicketId: string;
    Note: string;
}

export interface PaymentHistory {
    Id: number;
    DateTime: string;
    AmountPaid: number;
    PaymentMode?: string;
}

export class PaymentSettle {
    TicketId: number;
    Charged: number;
    Discount: number;
    FinancialYear: string;
    PaymentMode: string;
    UserName: string;
    PosSettle?: OrderItemRequest;
}
export class TicketReference {
    Id: number;
    Name: string;
}