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
var table_actions_1 = require("../actions/table.actions");
var table_adapter_1 = require("../adapters/table.adapter");
function TablesReducer(state, action) {
    if (state === void 0) { state = table_adapter_1.InitialState; }
    switch (action.type) {
        case table_actions_1.ActionTypes.SET_CURRENT_TABLE_ID: {
            return __assign({}, state, { CurrentTableId: action.payload });
        }
        case table_actions_1.ActionTypes.LOAD_ALL_SUCCESS: {
            return __assign({}, state, table_adapter_1.TableAdapter.addAll(action.payload.tables, state));
        }
        case table_actions_1.ActionTypes.LOAD_SUCCESS || table_actions_1.ActionTypes.CREATE_SUCCESS: {
            return __assign({}, state, table_adapter_1.TableAdapter.addOne(action.payload.table, state));
        }
        case table_actions_1.ActionTypes.PATCH_SUCCESS: {
            return __assign({}, state, table_adapter_1.TableAdapter.updateOne(action.payload.table, state));
        }
        case table_actions_1.ActionTypes.DELETE_SUCCESS: {
            return __assign({}, state, table_adapter_1.TableAdapter.removeOne(action.payload.tableId, state));
        }
        default:
            return state;
    }
}
exports.TablesReducer = TablesReducer;
