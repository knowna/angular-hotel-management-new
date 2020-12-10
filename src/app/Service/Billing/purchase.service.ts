﻿
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Global } from 'src/app/Shared/global';


@Injectable()

export class PurchaseService {

    constructor(private _http: HttpClient) { }


    get(url: string): Observable<any> {
        return this._http.get(url).pipe(

            catchError(this.handleError));
    }

    post(url: string, model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.post(url, body, options).pipe(

            catchError(this.handleError));
    }

    put(url: string, id: number, model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.put(url + id, body, options).pipe(

            catchError(this.handleError));
    }

    // delete(url: string, id: number): Observable<any> {
    //     let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //     let options = ({ headers: headers });
    //     return this._http.delete(url + id, options).pipe(

    //         catchError(this.handleError));
    // }

    delete(url: string, model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers, body: body });
        return this._http.delete(url, options)
            .catch(this.handleError);
    }


    getInventoryItems():any {
        return this._http.get(Global.BASE_HOST_ENDPOINT + "/api/InventoryItemAPI/get")
            .pipe(
                catchError(this.handleError)
            )
    }

    getSalesItems():any {
        return this._http.get(Global.BASE_HOST_ENDPOINT + "/api/MenuCategoryItemAPI")
            .pipe(
                catchError(this.handleError)
            )
    }

    getAccounts():any {

        return this._http.get(Global.BASE_HOST_ENDPOINT + "/api/AccountAPI/get")
            .pipe(
                catchError(this.handleError)
            )
    } 

    private handleError(error: HttpErrorResponse) {
        return throwError(error.message || 'Server error');
    }



}

