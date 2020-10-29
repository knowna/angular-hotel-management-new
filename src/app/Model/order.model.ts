import { Ticket } from './ticket.model';

/**	
 * Defines the model/interface for order entity
 */
export class Order {
    Id: number;
    TableId: string;
    OrderNumber: number;
    UserId: number;
    OrderOpeningTime: number;
    OrderStatus: string;
    OrderItems: OrderItem[];

    constructor(order: any) {
        this.Id = order.Id;
        this.TableId = order.TableId;
        this.OrderNumber = order.OrderNumber;
        this.UserId = order.UserId;
        this.OrderOpeningTime = order.OrderOpeningTime;
        this.OrderStatus = order.OrderStatus;
        this.OrderItems = order.OrderItems;
    }
}

// Order Item Request Object
export class OrderItemRequest {
    TicketId: number;
    TableId: string;
    CustomerId: number;
    OrderId: number;
    OrderItem: OrderItem;
    TicketTotal: number;
    ServiceCharge: number;
    Discount: number;
    VatAmount: number;
    GrandTotal: number;
    Balance: number;
    UserId?: string;
    FinancialYear?: string;
}

// Order Item Response Object
export class OrderItemResponse {
    TicketId: number;
    TableId: string;
    CustomerId: number;
    OrderId: number;
    Order: Order;
    Ticket?: Ticket;
}

// Oder Item Model
export class OrderItem {
    Id?: number;
    UserId?: string;
    FinancialYear?: string;
    OrderId?: number;
    OrderNumber?: number;
    ItemId?: number;    
    Qty?: number;
    UnitPrice?: number;
    TotalAmount?: number;
    OrderDescription:string;
    Tags?: any;
    IsSelected?: boolean;
    IsVoid?: boolean;
    Current?: boolean;
}

export class MoverOrderItem {
    requestObjectForMovedOrderItem: OrderItemRequest;
    requestObjectWithoutMovedOrderItem: OrderItemRequest;
    constructor(moverorderItem: any) {
        this.requestObjectForMovedOrderItem = moverorderItem.requestObjectForMovedOrderItem;
        this.requestObjectWithoutMovedOrderItem = moverorderItem.requestObjectWithoutMovedOrderItem;
    }
}