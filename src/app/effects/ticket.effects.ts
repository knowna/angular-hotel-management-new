import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect ,ofType, createEffect} from '@ngrx/effects';

import { Observable } from 'rxjs';

import { map,catchError,switchMap,mergeMap } from 'rxjs/operators';
import { Ticket } from '../Model/ticket.model';
import { TicketService } from '../Service/Billing/ticket.service';

import * as ticketActions from '../actions/ticket.actions';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class TicketEffects {

    // Constructor
    constructor(
        private api: TicketService,
        private actions$: Actions
    ) { }

    @Effect()
    loadTableTicketsAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
        ofType(ticketActions.ActionTypes.LOAD_TABLE_TICKETS),
        map((action: ticketActions.LoadTableTicketsAction) => action.payload),
        switchMap((tableId: string) => this.api.loadTableTickets(tableId).pipe(
            mergeMap(res => [
                new ticketActions.LoadTableTicketsSuccessAction({ 'tickets': res }),
                new ticketActions.IsTicketLoadingSuccessAction()
            ]),
            catchError(() => Observable.of({ 'type': ticketActions.ActionTypes.LOAD_ERROR }))
        ))));

    @Effect()
    loadCustomerTicketsAction$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
        ofType(ticketActions.ActionTypes.LOAD_CUSTOMER_TICKETS),
        map((action: ticketActions.LoadCustomerTicketsAction) => action.payload),
        switchMap((customerId: string) => this.api.loadCustomerTickets(customerId).pipe(
            mergeMap(res => [
                new ticketActions.LoadCustomerTicketsSuccessAction({ 'tickets': res }),
                new ticketActions.IsTicketLoadingSuccessAction()
            ]),
            catchError(() => Observable.of({ 'type': ticketActions.ActionTypes.LOAD_ERROR }))
        ))));

    @Effect()
    createNewTicket$ :Observable<Action> =createEffect(():any=> this.actions$.pipe(
        ofType(ticketActions.ActionTypes.CREATE_NEW_TICKET),
        map((action: ticketActions.CreateTableTicketAction) => action.payload),
        switchMap((data: any) => this.api.createNewTicket(data).pipe(
            map(res  => new ticketActions.CreateTableTicketSuccessAction({ 'ticket': res })),
            catchError(() => Observable.of({ 'type': ticketActions.ActionTypes.LOAD_ERROR }))
        ))));

    @Effect()
    payTicketByCash$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
        ofType(ticketActions.ActionTypes.PAY_BY_CASH),
        map((action: ticketActions.PayTicketByCashAction) => action.payload),
        switchMap((payload: any) => this.api.payTicketByCash(payload.ticketId, payload.details).pipe(
            mergeMap((ticket: Ticket) => {
                return [
                    new ticketActions.PayTicketByCashSuccessAction({ "id": ticket.Id, "changes": ticket }),
                    new ticketActions.IsTicketLoadingSuccessAction(),
                    new ticketActions.AddTicketPaymentMessageSuccessAction('message')
                ];
            }),
            catchError(() => Observable.of({ 'type': ticketActions.ActionTypes.LOAD_ERROR }))
        ))));

    @Effect()
    payTicketByCard$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
        ofType(ticketActions.ActionTypes.PAY_BY_CARD),
        map((action: ticketActions.PayTicketByCardAction) => action.payload),
        switchMap((payload: any) => this.api.payTicketByCard(payload.ticketId, payload.details).pipe(
            mergeMap((ticket: Ticket) => {
                return [
                    new ticketActions.PayTicketByCardSuccessAction({ "id": ticket.Id, "changes": ticket }),
                    new ticketActions.IsTicketLoadingSuccessAction(),
                    new ticketActions.AddTicketPaymentMessageSuccessAction('message')
                ];
            }),
            catchError(() => Observable.of({ 'type': ticketActions.ActionTypes.LOAD_ERROR }))
        ))));

    @Effect()
    payTicketByVoucher$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
        ofType(ticketActions.ActionTypes.PAY_BY_VOUCHER),
        map((action: ticketActions.PayTicketByVoucherAction) => action.payload),
        switchMap((payload: any) => this.api.payTicketByVoucher(payload.ticketId, payload.details).pipe(
            mergeMap((ticket: Ticket) => {
                return [
                    new ticketActions.PayTicketByVoucherSuccessAction({ "id": ticket.Id, "changes": ticket }),
                    new ticketActions.IsTicketLoadingSuccessAction(),
                    new ticketActions.AddTicketPaymentMessageSuccessAction('message')
                ];
            }),
            catchError(() => Observable.of({ 'type': ticketActions.ActionTypes.LOAD_ERROR }))
        ))));

    @Effect()
    payTicketByCustomerAccount$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
        ofType(ticketActions.ActionTypes.PAY_BY_CUSTOMER_ACCOUNT),
        map((action: ticketActions.PayTicketByCustomerAccountAction) => action.payload),
        switchMap((payload: any) => this.api.payTicketByCash(payload.ticketId, payload.details)
            .mergeMap((ticket: Ticket) => {
                return [
                    new ticketActions.PayTicketByCustomerAccountSuccessAction({ "id": ticket.Id, "changes": ticket }),
                    new ticketActions.IsTicketLoadingSuccessAction(),
                    new ticketActions.AddTicketPaymentMessageSuccessAction('message')
                ];
            }),
            catchError(() => Observable.of({ 'type': ticketActions.ActionTypes.LOAD_ERROR }))
     ) ));

    @Effect()
    roundOffTicket$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
        ofType(ticketActions.ActionTypes.ROUND_OFF_TICKET),
        map((action: ticketActions.RoundOffTicketAction) => action.payload),
        switchMap((payload: any) => this.api.payTicketByCash(payload.ticketId, payload.details).pipe(
            map((ticket: Ticket) => new ticketActions.RoundOffTicketSuccessAction({ "id": ticket.Id, "changes": ticket })),
            catchError(() => Observable.of({ 'type': ticketActions.ActionTypes.LOAD_ERROR }))
        ))));

    @Effect()
    addTicketNote$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
        ofType(ticketActions.ActionTypes.ADD_TICKET_NOTE),
        map((action: ticketActions.AddTicketNoteAction) => action.payload),
        switchMap((payload: any) => this.api.addTicketNote(payload.ticketId, payload.note).pipe(
            map(res => new ticketActions.AddTicketNoteSuccessAction({ 'ticket': res })),
            catchError(() => Observable.of({ 'type': ticketActions.ActionTypes.LOAD_ERROR }))
        ))));

    @Effect()
    printBill$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
        ofType(ticketActions.ActionTypes.PRINT_BILL),
        map((action: ticketActions.PrintBillAction) => action.payload),
        switchMap((payload: any) => this.api.printBill(payload.ticketId).pipe(
            map((res:any) => new ticketActions.PrintBillSuccessAction({ 'ticket': res })),
            catchError(() => Observable.of({ 'type': ticketActions.ActionTypes.LOAD_ERROR }))
    ))));
    
    @Effect()
    addDiscount$:Observable<Action> =createEffect(():any=> this.actions$.pipe(
        ofType(ticketActions.ActionTypes.ADD_DISCOUNT),
        map((action: ticketActions.AddTicketDiscountAction) => action.payload),
        switchMap((payload: any) => this.api.addDiscount(payload.ticketDetails).pipe(
            mergeMap((ticket: Ticket) => [
                new ticketActions.AddTicketDiscountSuccessAction({ "id": ticket.Id, "changes": ticket }),
                new ticketActions.IsTicketLoadingSuccessAction()
            ]),
            catchError(() => Observable.of({ 'type': ticketActions.ActionTypes.LOAD_ERROR }))
        ))));
}
