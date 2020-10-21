"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// Selectors
var TicketSelector = require("../../../selectors/ticket.selector");
var CustomerSelector = require("../../../selectors/customer.selector");
var PosTicketsComponent = /** @class */ (function () {
    // Constructor
    function PosTicketsComponent(store, router, activatedRoute, ticketStoreService) {
        var _this = this;
        this.store = store;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.ticketStoreService = ticketStoreService;
        this.tickets = [];
        this.activatedRoute.params.subscribe(function (params) {
            _this.tableId = params['tableId'] || '';
            _this.customerId = params['customerId'] || '';
            var currentUrl = _this.router.url;
            var emptyTicketIndex = currentUrl.indexOf('empty-ticket');
            if (emptyTicketIndex !== -1) {
                _this.isTicketEmpty = true;
            }
            else {
                _this.tableId ? _this.ticketStoreService.loadTicketsByTable(_this.tableId) : '';
                _this.customerId ? _this.ticketStoreService.loadTicketsByCustomer(_this.customerId) : '';
            }
        });
    }
    // Initialize data here
    PosTicketsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.customer$ = this.store.select(CustomerSelector.getCurrentCustomer);
        this.store.select(TicketSelector.getAllTickets)
            .subscribe(function (tickets) {
            
            if (_this.router.url == "/pos/settle") {
                return false;
            }
            _this.tickets = tickets || [];
            if (_this.tickets.length === 1) {
                (_this.tableId) && _this.goToTableTicketDetailView(_this.tickets[0].Id);
                (_this.customerId) && _this.goToCustomerTicketDetailView(_this.tickets[0].Id);
                return true;
            }
            if (_this.router.url.indexOf('move') !== -1) {
                _this.toOpenTicketId && _this.tickets.forEach(function (ticket) {
                    if (ticket.Id == _this.toOpenTicketId) {
                        (_this.tableId) && _this.goToTableTicketDetailView(ticket.Id);
                        (_this.customerId) && _this.goToCustomerTicketDetailView(ticket.Id);
                    }
                });
            }
        });
    };
    // Load the ticket detail view
    PosTicketsComponent.prototype.loadDetailView = function (ticketId, customerId) {
        this.tableId && this.goToTableTicketDetailView(ticketId);
        this.customerId && this.goToCustomerTicketDetailView(ticketId);
    };
    // Redirects to Tickets list view
    PosTicketsComponent.prototype.goToTableTicketDetailView = function (ticketId) {
        if (!ticketId) {
            return false;
        }
        this.router.navigate(['/table/' + this.tableId + '/ticket/' + ticketId]);
    };
    // Redirects to Tickets list view
    PosTicketsComponent.prototype.goToCustomerTicketDetailView = function (ticketId) {
        
        if (!ticketId) {
            return false;
        }
        this.router.navigate(['/customer/' + this.customerId + '/ticket/' + ticketId]);
    };
    __decorate([
        core_1.Input('table')
    ], PosTicketsComponent.prototype, "table", void 0);
    __decorate([
        core_1.Input('toOpenTicketId')
    ], PosTicketsComponent.prototype, "toOpenTicketId", void 0);
    PosTicketsComponent = __decorate([
        core_1.Component({
            selector: 'pos-tickets',
            templateUrl: './pos-tickets.component.html',
            styleUrls: ['./pos-tickets.component.css']
        })
    ], PosTicketsComponent);
    return PosTicketsComponent;
}());
exports.PosTicketsComponent = PosTicketsComponent;
