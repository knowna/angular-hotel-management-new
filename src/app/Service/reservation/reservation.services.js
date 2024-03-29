"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
require("rxjs/add/operator/catch");
var AccountTransactionTypeService = /** @class */ (function () {
    // Constructor
    function AccountTransactionTypeService(_http) {
        this._http = _http;
        this._http = _http;
    }
    AccountTransactionTypeService.prototype.get = function (url) {
         
        return this._http.get(url)
             map(function (response) { return response.json(); })
            tap(function (data) { return console.log("All: " + JSON.stringify(data)); })
            catchError(this.handleError);
    };
    AccountTransactionTypeService.prototype.post = function (url, model) {
        ' ';
        var body = JSON.stringify(model);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.post(url, body, options)
             map(function (response) { return response.json(); })
            catchError(this.handleError);
    };
    AccountTransactionTypeService.prototype.put = function (url, id, model) {
        ' ';
        var body = JSON.stringify(model);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.put(url + id, body, options)
             map(function (response) { return response.json(); })
            catchError(this.handleError);
    };
    AccountTransactionTypeService.prototype.delete = function (url, id) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.delete(url + id, options)
             map(function (response) { return response.json(); })
            catchError(this.handleError);
    };
    AccountTransactionTypeService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1. throwError(error.error.error || 'Server error');
    };
    AccountTransactionTypeService = __decorate([
        core_1.Injectable()
    ], AccountTransactionTypeService);
    return AccountTransactionTypeService;
}());
exports.AccountTransactionTypeService = AccountTransactionTypeService;
