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
var AccountProfitAndLossComponent = /** @class */ (function () {
    function AccountProfitAndLossComponent(_ProfitAndLossService, modalService) {
        this._ProfitAndLossService = _ProfitAndLossService;
        this.modalService = modalService;
        this.inLoading = false;
    }
    AccountProfitAndLossComponent.prototype.ngOnInit = function () {
        this.LoadProfitAndLoss();
    };
    AccountProfitAndLossComponent.prototype.LoadProfitAndLoss = function () {
        var _this = this;
        debugger;
        this._ProfitAndLossService.get(global_1.Global.BASE_ACCOUNTPROFITANDLOSS_ENDPOINT)
            .subscribe(function (ProfitAndLosss) { _this.profitandloss = ProfitAndLosss; _this.inLoading = false; }, function (error) { return _this.msg = error; });
    };
    AccountProfitAndLossComponent = __decorate([
        core_1.Component({
            templateUrl: './AccountProfitAndLoss.Component.html'
        })
    ], AccountProfitAndLossComponent);
    return AccountProfitAndLossComponent;
}());
exports.AccountProfitAndLossComponent = AccountProfitAndLossComponent;
