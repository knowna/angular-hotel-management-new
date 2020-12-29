import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Global } from 'src/app/Shared/global';

@Injectable()
export class InventoryReceiptService {

    constructor(private _http: HttpClient) {
    }
  
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

    delete(url: string, model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers, body: body });
        return this._http.delete(url, options).pipe(
            catchError(this.handleError));
    }

   
    private handleError (error:HttpErrorResponse) {
        console.error(error);
           return  throwError(error.error|| 'Server error');  
    }

  
    getInventoryItems():any{
        return this._http.get(Global.BASE_HOST_ENDPOINT + "/api/InventoryItemAPI/get");
    } 

    getAccounts():any {
        return this._http.get(Global.BASE_HOST_ENDPOINT + "/api/AccountAPI/get");
    } 
}

