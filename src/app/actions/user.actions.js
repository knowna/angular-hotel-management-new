"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// User Action Types defination
exports.ActionTypes = {
    // Loading Users
    LOAD: '[User] -> Load (requested)',
    LOAD_COMPLETED: '[User] -> Load (completed)',
    LOAD_ERROR: '[User] -> Load (error)'
};
// User Actions defination
// Load payload for single user
var UserPayLoad = /** @class */ (function () {
    function UserPayLoad(user) {
        this.user = user;
    }
    return UserPayLoad;
}());
exports.UserPayLoad = UserPayLoad;
// Load ---------------------------------------------
// Load action for user
var LoadAction = /** @class */ (function () {
    // Constructor
    function LoadAction(payload) {
        if (payload === void 0) { payload = null; }
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.LOAD;
    }
    return LoadAction;
}());
exports.LoadAction = LoadAction;
// On successful load of users
var LoadCompletedAction = /** @class */ (function () {
    // Constructor
    function LoadCompletedAction(payload) {
        this.payload = payload;
        // Variables
        this.type = exports.ActionTypes.LOAD_COMPLETED;
    }
    return LoadCompletedAction;
}());
exports.LoadCompletedAction = LoadCompletedAction;
// On unsuccessful load of users
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
