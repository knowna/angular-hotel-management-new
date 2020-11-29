﻿import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Global } from 'src/app/Shared/global';

@Injectable()
export class InventoryItemService {

    _entityUrl: string = '';
    constructor(private _http: HttpClient) { }

    get(url: string): Observable<any> {
        return this._http.get(url)
            .pipe(
                catchError(this.handleError));
    }

    post(url: string, model: any): Observable<any> {
        console.log(model);
        
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

    getCategories():any {
        return this._http.get(Global.BASE_CATEGORY_ENDPOINT);
    }

    getMenuUnits(url: string):any {
        return this._http.get(url);
    }

    //getInventoryItems() {
    //    return this._http.get("/api/InventoryItemAPI/Get").map((responseData) => responseData.json());
    //}
    private handleError (error:HttpErrorResponse) {
        console.error(error);
           return  throwError(error.error|| 'Server error');  
    }

}