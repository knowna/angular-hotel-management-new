import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {HttpClient,HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import {map,tap,catchError} from "rxjs/operators";
import { throwError } from 'rxjs';

@Injectable()
export class RoleService {
    constructor(private _http: HttpClient) { }

    get(url: string): Observable<any> {
        return this._http.get(url).pipe(
                tap(data => console.log("All: " + JSON.stringify(data))),
            catchError(this.handleError));
    }

    post(url: string, model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.post(url, body, options).pipe(
                catchError(this.handleError));
    }

    gets(url: string): Observable<any> {
         
        return this._http.get(url).pipe(
                catchError(this.handleError));
    }

    posts(url: string, model: any): Observable<any> {
         
        let body = JSON.stringify(model);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.post(url, body, options).pipe(
                catchError(this.handleError));
    }

    put(url: string, Id: number, model: any): Observable<any> {
         
        let body = JSON.stringify(model);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.put(url + '?id=' +Id, body, options).pipe(
                catchError(this.handleError));
    }

    delete(url: string, id: number): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.delete(url + '?id=' + id, options).pipe(
                catchError(this.handleError));
    }

    getRoles() {
        return this._http.get("/api/RoleAPI/get").pipe(
            map((responseData) => responseData))
    
    }

    private handleError (error:HttpErrorResponse) {
        console.error(error);
           return  throwError(error.message|| 'Server error');  
    }
}