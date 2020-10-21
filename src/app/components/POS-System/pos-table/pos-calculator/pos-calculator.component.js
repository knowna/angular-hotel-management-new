"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var PosCalculatorComponent = /** @class */ (function () {
    function PosCalculatorComponent() {
        this.updateQty = new core_1.EventEmitter();
    }
    /**
     * Update the calculated value as quantity
     * @param value
     */
    PosCalculatorComponent.prototype.updateOutput = function (value, isManual) {
        if (isManual === void 0) { isManual = false; }
        this.output = isManual ? String(value) : this.output + String(value);
        this.updateQty.emit(this.output);
    };
    ;
    __decorate([
        core_1.Input()
    ], PosCalculatorComponent.prototype, "output", void 0);
    __decorate([
        core_1.Output()
    ], PosCalculatorComponent.prototype, "updateQty", void 0);
    PosCalculatorComponent = __decorate([
        core_1.Component({
            selector: 'pos-calculator',
            templateUrl: './pos-calculator.component.html',
            styleUrls: ['./pos-calculator.component.css']
        })
    ], PosCalculatorComponent);
    return PosCalculatorComponent;
}());
exports.PosCalculatorComponent = PosCalculatorComponent;
