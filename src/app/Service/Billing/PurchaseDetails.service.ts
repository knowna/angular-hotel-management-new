import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class PurchaseDetailsService {
    constructor(private _http: HttpClient) {
        this._http = _http;
    }


    delete(url: string, id: number): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.delete(url + id, options).pipe(

            catchError(this.handleError));
    }



    private handleError(error: HttpErrorResponse) {
        return throwError(error.message || 'Server error');
    }


}