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
var product_actions_1 = require("../actions/product.actions");
var product_adapter_1 = require("../adapters/product.adapter");
function ProductsReducer(state, action) {
    if (state === void 0) { state = product_adapter_1.InitialState; }
    switch (action.type) {
        case product_actions_1.ActionTypes.LOAD_PRODUCTS_SUCCESS:
            return __assign({}, state, product_adapter_1.ProductAdapter.addAll(action.payload.products, state));
        default:
            return state;
    }
}
exports.ProductsReducer = ProductsReducer;
