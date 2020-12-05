"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var global_1 = require("../../../Shared/global");
var AccountLedgerViewComponent = /** @class */ (function () {
    /**
     * Ledger View Constructor
     */
    function AccountLedgerViewComponent(_journalvoucherService, modalService) {
        var _this = this;
        this._journalvoucherService = _journalvoucherService;
        this.modalService = modalService;
        this.inLoading = false;
        this._journalvoucherService.getAccounts().subscribe(function (data) { _this.accountledger = data; });
    }
    /**
     * Overrides OnInit component
     */
    AccountLedgerViewComponent.prototype.SearchLedgerTransaction = function (Id) {
        var _this = this;
        debugger;
        this.inLoading = true;
        this._journalvoucherService.get(global_1.Global.BASE_ACCOUNTLEDGERVIEW_ENDPOINT + '?LedgerId=' + Id)
            .subscribe(function (LV) {
            _this.LedgerViews = LV;
            _this.inLoading = false;
        }, function (error) { return _this.msg = error; });
        return this.LedgerViews;
    };
    AccountLedgerViewComponent = __decorate([
        core_1.Component({
            templateUrl: './AccountLedgerView.Component.html'
        })
    ], AccountLedgerViewComponent);
    return AccountLedgerViewComponent;
}());
exports.AccountLedgerViewComponent = AccountLedgerViewComponent;
