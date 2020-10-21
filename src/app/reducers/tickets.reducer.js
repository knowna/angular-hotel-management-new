"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ticket_actions_1 = require("../actions/ticket.actions");
var ticket_adapter_1 = require("../adapters/ticket.adapter");
function TicketsReducer(state, action) {
    if (state === void 0) { state = ticket_adapter_1.InitialState; }
    switch (action.type) {
        case ticket_actions_1.ActionTypes.CREATE_NEW_TICKET_SUCCESS: {
            return __assign({}, state, ticket_adapter_1.TicketAdapter.addOne(action.payload.ticket, state));
        }
        case ticket_actions_1.ActionTypes.SET_CURRENT_TICKET_ID: {
            return __assign({}, state, { CurrentTicketId: action.payload ? action.payload : '' });
        }
        case ticket_actions_1.ActionTypes.CLEAR_TICKETS: {
            return ticket_adapter_1.TicketAdapter.removeAll(__assign({}, state, { CurrentTicketId: null }));
        }
        case ticket_actions_1.ActionTypes.LOAD_TABLE_TICKETS_SUCCESS:
        case ticket_actions_1.ActionTypes.LOAD_CUSTOMER_TICKETS_SUCCESS:
            return __assign({}, state, ticket_adapter_1.TicketAdapter.addAll(action.payload.tickets, state));
        case ticket_actions_1.ActionTypes.PAY_BY_CASH_SUCCESS:
        case ticket_actions_1.ActionTypes.PAY_BY_CARD_SUCCESS:
        case ticket_actions_1.ActionTypes.PAY_BY_VOUCHER_SUCCESS:
        case ticket_actions_1.ActionTypes.PAY_BY_CUSTOMER_ACCOUNT_SUCCESS:
        case ticket_actions_1.ActionTypes.ROUND_OFF_TICKET_SUCCESS:
        case ticket_actions_1.ActionTypes.ADD_TICKET_NOTE_SUCCESS:
        case ticket_actions_1.ActionTypes.PRINT_BILL_SUCCESS:
        case ticket_actions_1.ActionTypes.ADD_DISCOUNT_SUCCESS:
            
            return __assign({}, state, ticket_adapter_1.TicketAdapter.updateOne(action.payload.ticket, state));
        default:
            return state;
    }
}
exports.TicketsReducer = TicketsReducer;
