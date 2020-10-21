// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import { Store } from '@ngrx/store';

// // Models
// import { Order, OrderItem } from '../../../Model/order.model';
// import { Product } from '../../../Model/product.model';

// // Selectors
// import * as ProductSelector from '../../../selectors/product.selector';
// import * as OrderSelector from '../../../selectors/order.selector';

// // Services
// import { ProductStoreService } from '../../../Service/store/product.store.service';
// import { OrderStoreService } from '../../../Service/store/order.store.service';

// //// Third Party library
// //import io  from "socket.io-client";

// @Component({
//   selector: 'app-kitchen-orders',
//   templateUrl: './kitchen-orders.component.html',
//   styleUrls: ['./kitchen-orders.component.css']
// })
// export class KitchenOrdersComponent implements OnInit {
// 	products$: Observable<Product[]>;
// 	orders$: Observable<Order[]>;

// 	parsedOrders: Order[];
// 	selectedCustomer: number;	
// 	selectedTable: string;

// 	private url = 'http://localhost:51779';
//   private socket;	

// 	// Constructor
// 	constructor(
// 		private store: Store<any>,
// 		private router: Router,
// 		private activatedRoute: ActivatedRoute, 
// 		private productStoreApi: ProductStoreService,		
// 		private orderStoreApi: OrderStoreService
// 	) {
// 		this.orderStoreApi.loadKitchenOrders();
// 	}

// 	// Initialize daata here
//     ngOnInit() {
// 		// Init Required data
// 		this.products$ = this.store.select(ProductSelector.getAllProducts);
//     this.orders$ = this.store.select(OrderSelector.getAllOrders);
// 		this.orders$.subscribe((orders: Order[]) => this.parsedOrders = orders);
		
// 		// Socket things
// 		//this.socket = io.connect(this.url);
//     this.socket.on('Orders::Added', (data) => {
// 			
//       console.log('Order Added: ' + JSON.stringify(data));
//       this.orderStoreApi.loadKitchenOrders();
//     });
//   }
// }


// // import { Component, OnInit } from '@angular/core';
// // import { HubConnection } from '@aspnet/signalr';
// // import * as signalR from '@aspnet/signalr';
 
// // @Component({
// //     selector: 'app-home-component',
// //     templateUrl: './home.component.html'
// // })
 
// // export class HomeComponent implements OnInit {
// //     private _hubConnection: HubConnection | undefined;
// //     public async: any;
// //     message = '';
// //     messages: string[] = [];
 
// //     constructor() {
// //     }
 
// //     public sendMessage(): void {
// //         const data = `Sent: ${this.message}`;
 
// //         if (this._hubConnection) {
// //             this._hubConnection.invoke('Send', data);
// //         }
// //         this.messages.push(data);
// //     }
 
// //     ngOnInit() {
// //         this._hubConnection = new signalR.HubConnectionBuilder()
// //             .withUrl('https://localhost:44324/loopy')
// //             .configureLogging(signalR.LogLevel.Information)
// //             .build();
 
// //         this._hubConnection.start().catch(err => console.error(err.toString()));
 
// //         this._hubConnection.on('Send', (data: any) => {
// //             const received = `Received: ${data}`;
// //             this.messages.push(received);
// //         });
// //     }
// // }
