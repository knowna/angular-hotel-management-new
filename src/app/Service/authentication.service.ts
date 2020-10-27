import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as jwt_decode from 'jwt-decode';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as ActionTypes from '../actions/auth.action';
import { IUser } from '../Model/User/user';
import * as fromAuth from '../reducers/auth.reducer';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient,public router:Router,public store:Store<{auth:fromAuth.State}>) { }

    login(url:string,model: any){
       
        let body = JSON.stringify(model);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        return this.http.post<IUser>(url, body, options).pipe(
            
            catchError(this.handleError)
        )}
    public isAuthenticated(): boolean {
        
        const user = localStorage.getItem('userToken');
        if (user)
        {
            return true;
        }
        else
        {
            return false; 
        }
    }
    authenticate(){
        this.store.dispatch({type:ActionTypes.ActionTypes.IS_AUTHENTICATED})
    }
    logout() {
        // remove user from local storage to log user out
        this.store.dispatch({type:ActionTypes.ActionTypes.IS_UNAUTHENTICATED})
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login'])
    }
    public get(url){
       return this.http.get(url).pipe(
            catchError(this.handleError)
        )
    }
    public handleError(error:HttpErrorResponse){
        return throwError(error.error);
    }
}