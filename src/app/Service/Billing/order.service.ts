// Main dependencies
import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';

// Model
import { Order, OrderItem, OrderItemRequest, MoverOrderItem } from '../../Model/order.model';

// Mocks
import { OrdersMock } from '../../mocks/orders.mock';
import {map,tap,catchError} from "rxjs/operators";
// Environments
import * as env from '../../../environments/environment';

import { Global } from '../../Shared/global';
import { DeleteAction } from 'src/app/actions/table.actions';
import { throwError } from 'rxjs';

@Injectable(
    {providedIn:'root'}
)
export class OrderService {
    // Constructor
    constructor(private http: HttpClient) {}

    /**
     * Load All Orders
     */
	loadKitchenOrders(): Observable<Order[]> {
		return this.http.get('/db.new.json').pipe(
		  	map((res: Response) => {
			    let orders = res.json()['orders'];
			  
			    orders.forEach((order: Order) => {
					order.OrderItems.forEach((item: any) => {
						item.Tags = item.Tags.split(',');
				  	});
			    });
			  
			    return orders;
			}));
	}

    /**
     * // Load All Orders for the given TicketId
     * @param TicketId 
     */
    loadOrders(TicketId: string): Observable<Order[]> {
        return this.http.get(Global.BASE_ORDERS_ENDPOINT + "?TicketId=" + TicketId).pipe(
            map((res: HttpResponse<Order[]>) => {
                let orders = res.body;
                orders.forEach((order: Order) => {
                    order.OrderItems.forEach((item: any) => {
                        item.Tags = item.Tags.split(',');
                    });
                });

                return orders;
            }));
    }

    loadOrdersNew(TicketId: string): Observable<Order[]> {
        // Call to API here
        return this.http.get<Order[]>(Global.BASE_ORDERS_ENDPOINT + "?TicketId=" + TicketId).pipe(
            catchError(this.handleError)
        )
    }

	/**
	 * Adds product in the given order
	 * @param payload 
	 */
    addOrderProduct(payload: any) {
         
        console.log('in service', JSON.stringify(payload));
        // payload.OrderItem.Tags = <any>payload.OrderItem.Tags.join(',');
        
        return this.http.post(Global.BASE_ORDERS_ENDPOINT, payload)
           
        

    }


    addOrderProductList(payload: any) {
         
        console.log('in hereeerr service', JSON.stringify(payload));
        // payload.OrderItem.Tags = <any>payload.OrderItem.Tags.join(',');
        
        return this.http.post(Global.BASE_ADD_ORDERlIST_ENDPOINT, payload)
             
    }

	/**
	 * Updates Order Item to the given order
	 * @param OrderId 
	 * @param OrderItem 
	 */
    updateOrderProduct(updateType: string, orderItemRequest: any) {
        // ' '
        let newRequest = JSON.parse(JSON.stringify(orderItemRequest));
        // newRequest.OrderItem.Tags = <any>newRequest.OrderItem.Tags.join(',');
        // ' '
        return this.http.post(Global.BASE_ORDERSUPDATE_ENDPOINT + "?updateType=" + updateType, newRequest)
           
    }

	/**
	 * Adds product in the given order
	 * @param payload 
	 */
    deleteOrderProduct(payload: any) {
        return this.http.post(Global.BASE_ORDERSCancel_ENDPOINT, payload)
           
    }

	/**
	 * Sends a move order item request to server
	 * @param payload 
	 */
    moveOrderItems(payload: MoverOrderItem) {
        return this.http.post(Global.BASE_ORDERSMove_ENDPOINT, payload)
           
    }

    // Converts in to JSON String
    getBody(data: any) {
        return JSON.stringify(data);
    }

    private handleError (error:HttpErrorResponse) {
        console.error(error);
           return  throwError(error.error|| 'Server error');  
    }
}