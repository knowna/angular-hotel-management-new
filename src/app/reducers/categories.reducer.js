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
var category_actions_1 = require("../actions/category.actions");
var category_adapter_1 = require("../adapters/category.adapter");
function CategoriesReducer(state, action) {
    if (state === void 0) { state = category_adapter_1.InitialState; }
    switch (action.type) {
        case category_actions_1.ActionTypes.LOAD_CATEGORIES_SUCCESS:
            return __assign({}, state, category_adapter_1.CategoryAdapter.addAll(action.payload.categories, state));
        default:
            return state;
    }
}
exports.CategoriesReducer = CategoriesReducer;
