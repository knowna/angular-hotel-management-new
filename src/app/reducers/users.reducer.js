"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_actions_1 = require("../actions/user.actions");
function UsersReducer(state, action) {
    switch (action.type) {
        case user_actions_1.ActionTypes.LOAD_COMPLETED:
            return state = action.payload.user;
        default:
            return state;
    }
}
exports.UsersReducer = UsersReducer;
