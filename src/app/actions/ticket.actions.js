"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Ticket Action Types defination
exports.ActionTypes = {
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
    IS_TICKET_LOADING: '[Ticket Item] -> Is Ticket loading',
    IS_TICKET_LOADING_SUCCESS: '[Ticket Item] -> Is Ticket loading Success',
};
// Load payload for single ticket
var TicketPayLoad = /** @class */ (function () {
    function TicketPayLoad(ticket) {
        this.ticket = ticket;
    }
    return TicketPayLoad;
}());
exports.TicketPayLoad = TicketPayLoad;
// Load payload for all tickets
var TicketsPayLoad = /** @class */ (function () {
    function TicketsPayLoad(tickets) {
        this.tickets = tickets;
    }
    return TicketsPayLoad;
}());
exports.TicketsPayLoad = TicketsPayLoad;
// Load action for ticket
var LoadTableTicketsAction = /** @class */ (function () {
    // Constructor
    function LoadTableTicketsAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.LOAD_TABLE_TICKETS;
    }
    return LoadTableTicketsAction;
}());
exports.LoadTableTicketsAction = LoadTableTicketsAction;
// On successful load of tickets
var LoadTableTicketsSuccessAction = /** @class */ (function () {
    // Constructor
    function LoadTableTicketsSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.LOAD_TABLE_TICKETS_SUCCESS;
    }
    return LoadTableTicketsSuccessAction;
}());
exports.LoadTableTicketsSuccessAction = LoadTableTicketsSuccessAction;
var LoadCustomerTicketsAction = /** @class */ (function () {
    // Constructor
    function LoadCustomerTicketsAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // variables
        this.type = exports.ActionTypes.LOAD_CUSTOMER_TICKETS;
    }
    return LoadCustomerTicketsAction;
}());
exports.LoadCustomerTicketsAction = LoadCustomerTicketsAction;
var LoadCustomerTicketsSuccessAction = /** @class */ (function () {
    // Constructor
    function LoadCustomerTicketsSuccessAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // variables
        this.type = exports.ActionTypes.LOAD_CUSTOMER_TICKETS_SUCCESS;
    }
    return LoadCustomerTicketsSuccessAction;
}());
exports.LoadCustomerTicketsSuccessAction = LoadCustomerTicketsSuccessAction;
// On unsuccessful load of tickets
var LoadErrorAction = /** @class */ (function () {
    // Constructor
    function LoadErrorAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.LOAD_ERROR;
    }
    return LoadErrorAction;
}());
exports.LoadErrorAction = LoadErrorAction;
var SetCurrentTicketAction = /** @class */ (function () {
    // Constructor
    function SetCurrentTicketAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.SET_CURRENT_TICKET_ID;
    }
    return SetCurrentTicketAction;
}());
exports.SetCurrentTicketAction = SetCurrentTicketAction;
// Create New Table Ticket
var CreateTableTicketAction = /** @class */ (function () {
    // Constructor
    function CreateTableTicketAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.CREATE_NEW_TICKET;
    }
    return CreateTableTicketAction;
}());
exports.CreateTableTicketAction = CreateTableTicketAction;
// On successful creation of ticket
var CreateTableTicketSuccessAction = /** @class */ (function () {
    // Constructor
    function CreateTableTicketSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.CREATE_NEW_TICKET_SUCCESS;
    }
    return CreateTableTicketSuccessAction;
}());
exports.CreateTableTicketSuccessAction = CreateTableTicketSuccessAction;
// Pay Ticket by cash
var PayTicketByCashAction = /** @class */ (function () {
    // Constructor
    function PayTicketByCashAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.PAY_BY_CASH;
    }
    return PayTicketByCashAction;
}());
exports.PayTicketByCashAction = PayTicketByCashAction;
// On successful payment by cash
var PayTicketByCashSuccessAction = /** @class */ (function () {
    // Constructor
    function PayTicketByCashSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.PAY_BY_CASH_SUCCESS;
    }
    return PayTicketByCashSuccessAction;
}());
exports.PayTicketByCashSuccessAction = PayTicketByCashSuccessAction;
// Pay Ticket by card
var PayTicketByCardAction = /** @class */ (function () {
    // Constructor
    function PayTicketByCardAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.PAY_BY_CARD;
    }
    return PayTicketByCardAction;
}());
exports.PayTicketByCardAction = PayTicketByCardAction;
// On successful payment by card
var PayTicketByCardSuccessAction = /** @class */ (function () {
    // Constructor
    function PayTicketByCardSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.PAY_BY_CARD_SUCCESS;
    }
    return PayTicketByCardSuccessAction;
}());
exports.PayTicketByCardSuccessAction = PayTicketByCardSuccessAction;
// Pay Ticket by voucher
var PayTicketByVoucherAction = /** @class */ (function () {
    // Constructor
    function PayTicketByVoucherAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.PAY_BY_VOUCHER;
    }
    return PayTicketByVoucherAction;
}());
exports.PayTicketByVoucherAction = PayTicketByVoucherAction;
// On successful payment by voucher
var PayTicketByVoucherSuccessAction = /** @class */ (function () {
    // Constructor
    function PayTicketByVoucherSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.PAY_BY_VOUCHER_SUCCESS;
    }
    return PayTicketByVoucherSuccessAction;
}());
exports.PayTicketByVoucherSuccessAction = PayTicketByVoucherSuccessAction;
// Pay Ticket by Customer Account
var PayTicketByCustomerAccountAction = /** @class */ (function () {
    // Constructor
    function PayTicketByCustomerAccountAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.PAY_BY_CUSTOMER_ACCOUNT;
    }
    return PayTicketByCustomerAccountAction;
}());
exports.PayTicketByCustomerAccountAction = PayTicketByCustomerAccountAction;
// On successful payment by Customer Account
var PayTicketByCustomerAccountSuccessAction = /** @class */ (function () {
    // Constructor
    function PayTicketByCustomerAccountSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.PAY_BY_CUSTOMER_ACCOUNT_SUCCESS;
    }
    return PayTicketByCustomerAccountSuccessAction;
}());
exports.PayTicketByCustomerAccountSuccessAction = PayTicketByCustomerAccountSuccessAction;
// Round Off Ticket
var RoundOffTicketAction = /** @class */ (function () {
    // Constructor
    function RoundOffTicketAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.ROUND_OFF_TICKET;
    }
    return RoundOffTicketAction;
}());
exports.RoundOffTicketAction = RoundOffTicketAction;
// On successful ticket round off
var RoundOffTicketSuccessAction = /** @class */ (function () {
    // Constructor
    function RoundOffTicketSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.ROUND_OFF_TICKET_SUCCESS;
    }
    return RoundOffTicketSuccessAction;
}());
exports.RoundOffTicketSuccessAction = RoundOffTicketSuccessAction;
// Add Ticket Note
var AddTicketNoteAction = /** @class */ (function () {
    // Constructor
    function AddTicketNoteAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.ADD_TICKET_NOTE;
    }
    return AddTicketNoteAction;
}());
exports.AddTicketNoteAction = AddTicketNoteAction;
// Add Ticket Note
var AddTicketMessageAction = /** @class */ (function () {
    // Constructor
    function AddTicketMessageAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.ADD_TICKET_MESSAGE;
    }
    return AddTicketMessageAction;
}());
exports.AddTicketMessageAction = AddTicketMessageAction;
// On successful addition of ticket note
var AddTicketMessageSuccessAction = /** @class */ (function () {
    // Constructor
    function AddTicketMessageSuccessAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.ADD_TICKET_MESSAGE_SUCCESS;
    }
    return AddTicketMessageSuccessAction;
}());
exports.AddTicketMessageSuccessAction = AddTicketMessageSuccessAction;
// On successful addition of ticket note
var AddTicketPaymentMessageSuccessAction = /** @class */ (function () {
    // Constructor
    function AddTicketPaymentMessageSuccessAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.ADD_TICKET_PAYMENT_MESSAGE_SUCCESS;
    }
    return AddTicketPaymentMessageSuccessAction;
}());
exports.AddTicketPaymentMessageSuccessAction = AddTicketPaymentMessageSuccessAction;
// On successful addition of ticket note
var AddTicketNoteSuccessAction = /** @class */ (function () {
    // Constructor
    function AddTicketNoteSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.ADD_TICKET_NOTE_SUCCESS;
    }
    return AddTicketNoteSuccessAction;
}());
exports.AddTicketNoteSuccessAction = AddTicketNoteSuccessAction;
// Add Ticket Note
var PrintBillAction = /** @class */ (function () {
    // Constructor
    function PrintBillAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.PRINT_BILL;
    }
    return PrintBillAction;
}());
exports.PrintBillAction = PrintBillAction;
// On successful addition of ticket note
var PrintBillSuccessAction = /** @class */ (function () {
    // Constructor
    function PrintBillSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.PRINT_BILL_SUCCESS;
    }
    return PrintBillSuccessAction;
}());
exports.PrintBillSuccessAction = PrintBillSuccessAction;
// On successful addition of ticket note
var ClearAllTickets = /** @class */ (function () {
    // Constructor
    function ClearAllTickets(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.CLEAR_TICKETS;
    }
    return ClearAllTickets;
}());
exports.ClearAllTickets = ClearAllTickets;
var AddTicketDiscountAction = /** @class */ (function () {
    // Constructor
    function AddTicketDiscountAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.ADD_DISCOUNT;
    }
    return AddTicketDiscountAction;
}());
exports.AddTicketDiscountAction = AddTicketDiscountAction;
var AddTicketDiscountSuccessAction = /** @class */ (function () {
    // Constructor
    function AddTicketDiscountSuccessAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.ADD_DISCOUNT_SUCCESS;
    }
    return AddTicketDiscountSuccessAction;
}());
exports.AddTicketDiscountSuccessAction = AddTicketDiscountSuccessAction;
var IsTicketLoadingAction = /** @class */ (function () {
    // Constructor
    function IsTicketLoadingAction(payload) {
        if (payload === void 0) { payload = true; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.IS_TICKET_LOADING;
    }
    return IsTicketLoadingAction;
}());
exports.IsTicketLoadingAction = IsTicketLoadingAction;
var IsTicketLoadingSuccessAction = /** @class */ (function () {
    // Constructor
    function IsTicketLoadingSuccessAction(payload) {
        if (payload === void 0) { payload = false; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.IS_TICKET_LOADING_SUCCESS;
    }
    return IsTicketLoadingSuccessAction;
}());
exports.IsTicketLoadingSuccessAction = IsTicketLoadingSuccessAction;
