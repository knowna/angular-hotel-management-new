﻿import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Global } from 'src/app/Shared/global';
import { throwError } from 'rxjs';

@Injectable()
export class PeriodicConsumptionItemService {

    constructor(private _http: HttpClient) { }

    get(url: string): Observable<any> {
        return this._http.get(url)
            .map((response: Response) => <any>response.json())
            .do(data => console.log("All: " + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getConsum(url: string): Observable<any> {
        return this._http.get(url)
            .map((response: Response) => <any>response.json())
            .do(data => console.log("All: " + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getCost(url: string): Observable<any> {
        return this._http.get(url)
            .map((response: Response) => <any>response.json())
            .do(data => console.log("All: " + JSON.stringify(data)))
            .catch(this.handleError);
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

    delete(url: string, id: number): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.delete(url + id, options).pipe(
            catchError(this.handleError));
    }

    getInventoryItems():any {
        return this._http.get(Global.BASE_HOST_ENDPOINT + "/api/InventoryItemAPI/get");
    }


    getInventoryReceipts():any {
        return this._http.get(Global.BASE_HOST_ENDPOINT + "/api/InventoryReceiptDetailAPI/get");
    }

    getWareHouse():any {
        return this._http.get(Global.BASE_HOST_ENDPOINT + "/api/WareHouseAPI/");
    } 

    private handleError (error:HttpErrorResponse) {
        return  throwError(error.error|| 'Server error');  
    }
}