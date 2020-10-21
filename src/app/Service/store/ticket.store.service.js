"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var actions = require("../../actions/ticket.actions");
var TicketStoreService = /** @class */ (function () {
    // Dispatch load all tickets event
    function TicketStoreService(store) {
        this.store = store;
    }
    /**
     * Loads tickets for given table
     * @param tableId
     */
    TicketStoreService.prototype.loadTicketsByTable = function (tableId) {
        this.store.dispatch(new actions.IsTicketLoadingAction());
        this.store.dispatch(new actions.LoadTableTicketsAction(tableId));
    };
    /**
     * Loads tickets by customer
     * @param customerId
     */
    TicketStoreService.prototype.loadTicketsByCustomer = function (customerId) {
        this.store.dispatch(new actions.IsTicketLoadingAction());
        this.store.dispatch(new actions.LoadCustomerTicketsAction(customerId));
    };
    /**
     * Clear All Tickets
     */
    TicketStoreService.prototype.clearAllTickets = function () {
        this.store.dispatch(new actions.ClearAllTickets());
    };
    /**
     * Sets Current Ticket Id in State
     * @param ticketId
     */
    TicketStoreService.prototype.setCurrentTicket = function (ticketId) {
        this.store.dispatch(new actions.SetCurrentTicketAction(ticketId));
    };
    /**
     * Create a new ticket on the current table
     * @param data
     */
    TicketStoreService.prototype.createNewTicket = function (data) {
        this.store.dispatch(new actions.CreateTableTicketAction({ "tableId": data.tableId, "customerId": data.customerId }));
    };
    /**
     * Add a new ticket note on the given ticket
     * @param ticketId
     * @param note
     *
     */
    TicketStoreService.prototype.addTicketNote = function (ticketId, note) {
        this.store.dispatch(new actions.AddTicketNoteAction({ "ticketId": ticketId, "note": note }));
    };
    /**
     * Pay ticket by cash
     * @param ticketId
     * @param details
     */
    TicketStoreService.prototype.payByCash = function (ticketId, details) {
        this.store.dispatch(new actions.IsTicketLoadingAction());
        this.store.dispatch(new actions.PayTicketByCashAction({ "ticketId": ticketId, "details": details }));
    };
    /**
     * Pay ticket by card
     * @param ticketId
     * @param details
     */
    TicketStoreService.prototype.payByCard = function (ticketId, details) {
        this.store.dispatch(new actions.IsTicketLoadingAction());
        this.store.dispatch(new actions.PayTicketByCardAction({ "ticketId": ticketId, "details": details }));
    };
    /**
     * Pay ticket by voucher
     * @param ticketId
     * @param details
     */
    TicketStoreService.prototype.payByVoucher = function (ticketId, details) {
        this.store.dispatch(new actions.IsTicketLoadingAction());
        this.store.dispatch(new actions.PayTicketByVoucherAction({ "ticketId": ticketId, "details": details }));
    };
    /**
     * Pay ticket by Customer Account
     * @param ticketId
     * @param details
     */
    TicketStoreService.prototype.payCustomerAccount = function (ticketId, details) {
        this.store.dispatch(new actions.IsTicketLoadingAction());
        this.store.dispatch(new actions.PayTicketByCustomerAccountAction({ "ticketId": ticketId, "details": details }));
    };
    /**
     * Make the ticket values round offed
     * @param ticketId
     * @param details
     */
    TicketStoreService.prototype.roundTicket = function (ticketId, details) {
        this.store.dispatch(new actions.RoundOffTicketAction({ "ticketId": ticketId, "details": details }));
    };
    /**
     * Make the ticket locked form backend
     * @param ticketId
     * @param details
     */
    TicketStoreService.prototype.printBill = function (ticketId) {
        this.store.dispatch(new actions.PrintBillAction({ "ticketId": ticketId }));
    };
    /**
     * Add the ticket discount to backend
     * @param ticketDetails
     */
    TicketStoreService.prototype.addDiscount = function (ticketDetails) {
        this.store.dispatch(new actions.IsTicketLoadingAction());
        this.store.dispatch(new actions.AddTicketDiscountAction({ "ticketDetails": ticketDetails }));
    };
    TicketStoreService = __decorate([
        core_1.Injectable()
    ], TicketStoreService);
    return TicketStoreService;
}());
exports.TicketStoreService = TicketStoreService;
