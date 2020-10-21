import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect,ofType, createEffect } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import { map,catchError,switchMap,mergeMap } from 'rxjs/operators';
import { Order, OrderItem, OrderItemResponse } from '../Model/order.model';
import { OrderService } from '../Service/Billing/order.service';

import * as orderActions from '../actions/order.actions';
import * as ticketActions from '../actions/ticket.actions';
import { DeleteAction } from '../actions/table.actions';


@Injectable()
export class TableOrderEffects {

	// Constructor
	constructor(
		private api: OrderService,
		private actions$: Actions
	) { }

	/**
	* Load Orders Effect
	* Loads orders for given ticket
	*/
	@Effect()
	loadAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(orderActions.ActionTypes.LOAD_ORDERS),
		map((action: orderActions.LoadOrdersAction) => action.payload.TicketId),
		switchMap((TicketId: string) => this.api.loadOrders(TicketId).pipe(
			mergeMap(res => [
				new orderActions.LoadOrdersSuccessAction({ 'orders': res }),
				new orderActions.IsOrderLoadingSuccessAction()
			]),
			catchError(() => Observable.of({ 'type': orderActions.ActionTypes.LOAD_ERROR }))
		))));

	

	@Effect()
	loadKitchenOrdersAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(orderActions.ActionTypes.LOAD_KITCHEN_ORDERS),
		map((action: orderActions.LoadOrdersAction) => action.payload),
		switchMap((TicketId: number) => this.api.loadKitchenOrders().pipe(
			mergeMap(res => [
				new orderActions.LoadOrdersSuccessAction({ 'orders': res }),
				new orderActions.IsOrderLoadingSuccessAction()
			]),
			catchError(() => Observable.of({ 'type': orderActions.ActionTypes.LOAD_ERROR }))
		))));


	@Effect()
	AddProductAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(orderActions.ActionTypes.ADD_PRODUCT),
		map((action: orderActions.AddProductAction) => action.payload),
		switchMap((payload: any) =>
			this.api.addOrderProduct(payload).pipe(
				mergeMap((res: OrderItemResponse) => {
					res.Order.OrderItems.map((item: OrderItem) => {
						item.Tags = item.Tags.split(",");
					});
					return [
						new ticketActions.CreateTableTicketSuccessAction({ 'ticket': res.Ticket }),
						new orderActions.AddProductSuccessAction(res.Order),
						new orderActions.IsOrderLoadingSuccessAction()
					]
				}),
				catchError(err => Observable.of(new orderActions.LoadErrorAction('Adding error')))
		))));

	/**
	 * Delete product from a specified order Effect
	 */
	@Effect()
	DeleteProductAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(orderActions.ActionTypes.DELETE_PRODUCT),
		map((action: orderActions.DeleteProductAction) => action.payload),
		switchMap((payload: DeleteAction) =>
			this.api.deleteOrderProduct(payload).pipe(
				mergeMap((res: OrderItemResponse) => [
					new orderActions.DeleteProductSuccessAction(res.Order),
					new orderActions.IsOrderLoadingSuccessAction()
				]),
				catchError(err => Observable.of(new orderActions.LoadErrorAction('Updating error')))
		))));

	@Effect()
	MoveItemsAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(orderActions.ActionTypes.MOVE_ORDER_ITEMS),
		map((action: orderActions.MoveOrderItemAction) => action.payload),
		switchMap((payload) =>
			this.api.moveOrderItems(payload).pipe(
				mergeMap((res: OrderItemResponse) => [
					new orderActions.MoveOrderItemSuccessAction({ 'orders': res }),
					new orderActions.IsOrderLoadingSuccessAction()
				]),
				catchError(err => Observable.of(new orderActions.LoadErrorAction('Updating error')))
		))));

	/**
	 * Move product form a specified order Effect
	 */
	@Effect()
	UpdateOrderItemAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
		ofType(orderActions.ActionTypes.UPDATE_PRODUCT),
		map((action: orderActions.MoveOrderItemAction) => action.payload),
		switchMap((payload: any) =>
			this.api.updateOrderProduct(payload.updateType, payload.orderItemRequest).pipe(
				mergeMap((res: OrderItemResponse) => {
					res.Order.OrderItems.map((item: OrderItem) => {
						item.Tags = item.Tags.split(",");
					});
					return [
						new orderActions.UpdateOrderItemSuccessAction({ 'OrderId': res.Order.OrderNumber, 'OrderItem': res.Order.OrderItems[0] }),
						new orderActions.IsOrderLoadingSuccessAction()
					];
				}),
				catchError(err => Observable.of(new orderActions.LoadErrorAction('Updating error')))
		))));
}
