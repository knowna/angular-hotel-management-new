"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var global_1 = require("../../Shared/global");
var TrialBalanceComponent = /** @class */ (function () {
    function TrialBalanceComponent(_TrialBalancesService, modalService) {
        this._TrialBalancesService = _TrialBalancesService;
        this.modalService = modalService;
        this.isLoading = false;
    }
    TrialBalanceComponent.prototype.ngOnInit = function () {
        this.LoadTrialBalance();
    };
    TrialBalanceComponent.prototype.LoadTrialBalance = function () {
        var _this = this;
        ;
        this.isLoading = true;
        this._TrialBalancesService.get(global_1.Global.BASE_ACCOUNTTRIALBALANCE_ENDPOINT)
            .subscribe(function (TrialBalances) { _this.TrialBalances = TrialBalances; _this.isLoading = false; }, function (error) { return _this.msg = error; });
    };
    TrialBalanceComponent.prototype.calcDebitTotal = function (TrialBalances) {
        ;
        var TotalDebit = 0;
        for (var i = 0; i < TrialBalances.length; i++) {
            TotalDebit = TotalDebit + parseFloat(TrialBalances[i].Debit);
        }
        return TotalDebit;
    };
    TrialBalanceComponent.prototype.calcCreditTotal = function (TrialBalances) {
        ;
        var TotalCredit = 0;
        for (var i = 0; i < TrialBalances.length; i++) {
            TotalCredit = TotalCredit + parseFloat(TrialBalances[i].Credit);
        }
        return TotalCredit;
    };
    TrialBalanceComponent = __decorate([
        core_1.Component({
            templateUrl: './TrialBalance.component.html'
        })
    ], TrialBalanceComponent);
    return TrialBalanceComponent;
}());
exports.TrialBalanceComponent = TrialBalanceComponent;
