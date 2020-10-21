import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import {map,tap,catchError} from 'rxjs/operators';
@Injectable(
    
)
export class AccountTransactionTypeService {
    // Constructor
    constructor(private _http : HttpClient) {
        
    }

    get(url: string): Observable<any> {
        console.log(url);
        return this._http.get(url).pipe(
             
            catchError(this.handleError));
    }

    post(url: string, model: any): Observable<any> {
        console.log(model);
        
        let body = JSON.stringify(model);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options =  ({ headers: headers });
        return this._http.post(url, body, options).pipe(
            catchError(this.handleError));
    }

    put(url: string, id: number, model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options =  ({ headers: headers });
        return this._http.put(url + id, body, options).pipe(
            catchError(this.handleError));
    }

    delete(url: string, id: number): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options =  ({ headers: headers });
        return this._http.delete(url + id, options).pipe(
            catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        
        return throwError(error.error || 'Server error');
    }
}
