import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable()
export class LoginService {
    constructor(private _http: HttpClient) { }

    get(url: string): Observable<any> {
        return this._http.get(url).pipe(
                tap(data => console.log("All: " + JSON.stringify(data))),
            catchError(this.handleError));
    }

    login(url: string, model: any): Observable<any> {
         ;
        let body = JSON.stringify(model);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        return this._http.post(url, body, options).pipe(
                catchError(this.handleError));
    }


    private handleError (error:HttpErrorResponse) {
        // ;
        console.error(error);
           return  throwError(error.message|| 'Server error');  
    }
}