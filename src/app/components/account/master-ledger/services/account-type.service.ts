import { Injectable } from '@angular/core';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
// import { AccountType } from '../Model/AccountType/accountType';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { AccountType } from 'src/app/Model/AccountType/accountType';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AccountTypeService {

    constructor(private _http: HttpClient) { }
    
    get(url: string): Observable<any> {
        return this._http.get(url)
            .map((response: Response) => <any>response.json())
            .do(data => console.log("All: " + JSON.stringify(data)))
            // .catch(this.handleError);
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

   
  
    getaccounttypes() {
        return this._http.get("/api/AccountTypeAPI/")
            .catch(this.handleError);
    }

    // private extractData(res: Response) {
    //     let body = <AccountType[]>res.json().accountType;    // return array from json file
    //     return body || [];     // also return empty array if there is no data
    // }

    private handleError(error: HttpErrorResponse) {
        return throwError(error.message || 'Server error');
    }
}