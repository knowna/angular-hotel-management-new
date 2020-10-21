import { Global } from '../Shared/global';

export interface IOrder {
    Id: number,
    TableId: number,
    OrderNumber: number,
    UserId: number,
    OrderStartTime: Date,
    LastOrderTime: Date,
    OrderStatus: string,
    LastPaymentTime: Date,
    GrandTotal: number,
    Charged: number,
    Balance: number,
    OrderDetails: OrderDetail[]
}

export interface OrderDetail {
    Id: number,
    UserId: number,
    OrderTime: Date,
    Quantity: number,
    MenuItemId: number,
    Price: number,
    status: boolean
}

export interface IScreenOrder {
    Id: number,
    TableId: number,
    OrderNumber: number,
    UserId: number,
    OrderStartTime: Date,
    LastOrderTime: Date,
    OrderStatus: boolean,
    LastPaymentTime: Date,
    GrandTotal: number,
    Charged: number,
    Balance: number,
    OrderDetails: ScreenOrderDetail[]
}

export interface ScreenOrderDetail {
    Id: number,
    UserId: number,
    OrderTime: Date,
    Quantity: number,
    MenuItemId: number,
    Price: number,
    status: boolean
}
export class IScreenOrders {
    Id: number;
    TableId: number;
    OrderNumber: number;
    UserId: number;
    OrderStartTime: Date;
    LastOrderTime: Date;
    OrderStatus: boolean;
    LastPaymentTime: Date;
    GrandTotal: number;
    Charged: number;
    Balance: number;
    constructor(TableId, OrderNumber, UserId, OrderStartTime, LastOrderTime, OrderStatus, LastPaymentTime, GrandTotal, Charged, Balance) {
        this.TableId = TableId;
        this.OrderNumber = OrderNumber;
        this.UserId = UserId;
        this.OrderStartTime = OrderStartTime;
        this.LastOrderTime = LastOrderTime;
        this.OrderStatus = OrderStatus;

    }
}


