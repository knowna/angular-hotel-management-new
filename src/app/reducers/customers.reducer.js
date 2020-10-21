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
var customer_actions_1 = require("../actions/customer.actions");
var customer_adapter_1 = require("../adapters/customer.adapter");
function CustomersReducer(state, action) {
    if (state === void 0) { state = customer_adapter_1.InitialState; }
    switch (action.type) {
        case customer_actions_1.ActionTypes.LOAD_COMPLETED:
            return __assign({}, state, customer_adapter_1.CustomerAdapter.addAll(action.payload.customers, state));
        case customer_actions_1.ActionTypes.SET_CURRENT_CUSTOMER:
            return __assign({}, state, { CurrentCustomerId: action.payload.customerId });
        default:
            return state;
    }
}
exports.CustomersReducer = CustomersReducer;
