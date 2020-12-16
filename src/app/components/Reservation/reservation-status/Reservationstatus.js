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
var RoomStatusComponent = /** @class */ (function () {
    /**
     * Sale Book Constructor
     */
    function RoomStatusComponent(_reservationService, modalService, date) {
        this._reservationService = _reservationService;
        this.modalService = modalService;
        this.date = date;
        this.isLoading = false;
        this.company = JSON.parse(localStorage.getItem('company'));
    }
    RoomStatusComponent.prototype.SearchLedgerTransaction = function (CurrentMonth) {
        var _this = this;
        this.isLoading = true;
        this._reservationService.get(global_1.Global.BASE_ROOM_STATUS_ENDPOINT)
            .subscribe(function (SB) {
            _this.RoomStatuss = SB;
            _this.isLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    RoomStatusComponent.prototype.exportTableToExcel = function (tableID, filename) {
        if (filename === void 0) { filename = ''; }
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var clonedtable = $('#' + tableID);
        var clonedHtml = clonedtable.clone();
        $(clonedtable).find('.export-no-display').remove();
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        $('#' + tableID).html(clonedHtml.html());
        // Specify file name
        filename = filename ? filename + '.xls' : 'Room Status Of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';
        // Create download link element
        downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], { type: dataType });
            navigator.msSaveOrOpenBlob(blob, filename);
        }
        else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
            // Setting the file name
            downloadLink.download = filename;
            //triggering the function
            downloadLink.click();
        }
    };
    RoomStatusComponent = __decorate([
        core_1.Component({
            templateUrl: './AccountSaleBook.Component.html'
        })
    ], RoomStatusComponent);
    return RoomStatusComponent;
}());
exports.RoomStatusComponent = RoomStatusComponent;
