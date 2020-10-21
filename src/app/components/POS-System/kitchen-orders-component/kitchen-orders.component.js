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
var ProductSelector = require("../../selectors/product.selector");
var OrderSelector = require("../../selectors/order.selector");
// Third Party library
var socket_io_client_1 = require("socket.io-client");
var KitchenOrdersComponent = /** @class */ (function () {
    // Constructor
    function KitchenOrdersComponent(store, router, activatedRoute, productStoreApi, orderStoreApi) {
        this.store = store;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.productStoreApi = productStoreApi;
        this.orderStoreApi = orderStoreApi;
        this.url = 'http://localhost:51779';
        this.orderStoreApi.loadKitchenOrders();
    }
    // Initialize daata here
    KitchenOrdersComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Init Required data
        this.products$ = this.store.select(ProductSelector.getAllProducts);
        this.orders$ = this.store.select(OrderSelector.getAllOrders);
        this.orders$.subscribe(function (orders) { return _this.parsedOrders = orders; });
        // Socket things
        this.socket = socket_io_client_1.default.connect(this.url);
        this.socket.on('Orders::Added', function (data) {
            
            console.log('Order Added: ' + JSON.stringify(data));
            _this.orderStoreApi.loadKitchenOrders();
        });
    };
    KitchenOrdersComponent = __decorate([
        core_1.Component({
            selector: 'app-kitchen-orders',
            templateUrl: './kitchen-orders.component.html',
            styleUrls: ['./kitchen-orders.component.css']
        })
    ], KitchenOrdersComponent);
    return KitchenOrdersComponent;
}());
exports.KitchenOrdersComponent = KitchenOrdersComponent;
// import { Component, OnInit } from '@angular/core';
// import { HubConnection } from '@aspnet/signalr';
// import * as signalR from '@aspnet/signalr';
// @Component({
//     selector: 'app-home-component',
//     templateUrl: './home.component.html'
// })
// export class HomeComponent implements OnInit {
//     private _hubConnection: HubConnection | undefined;
//     public async: any;
//     message = '';
//     messages: string[] = [];
//     constructor() {
//     }
//     public sendMessage(): void {
//         const data = `Sent: ${this.message}`;
//         if (this._hubConnection) {
//             this._hubConnection.invoke('Send', data);
//         }
//         this.messages.push(data);
//     }
//     ngOnInit() {
//         this._hubConnection = new signalR.HubConnectionBuilder()
//             .withUrl('https://localhost:44324/loopy')
//             .configureLogging(signalR.LogLevel.Information)
//             .build();
//         this._hubConnection.start().catch(err => console.error(err.toString()));
//         this._hubConnection.on('Send', (data: any) => {
//             const received = `Received: ${data}`;
//             this.messages.push(received);
//         });
//     }
// }
