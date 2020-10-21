// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
// import {map,tap,catchError} from "rxjs/operators";
// import { Observable, throwError } from 'rxjs';
// import { Room } from 'src/app/Model/reservation/room.model';


// @Injectable()
// export class  {
    
//     constructor(private _http:HttpClient) {
//         this._http = _http;
//     }
//     get(url: string): Observable<any> {
//         return this._http.get<any>(url).pipe(
//             // map((response: Response) => {<any>response}),
//             // tap(data => console.log("All: " + JSON.stringify(data))),
//             catchError(this.handleError));
//     }
//     post(url: string, model: any): Observable<any> {
        
//         let body = JSON.stringify(model);
//         let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//         let options =  ({ headers: headers });
//         return this._http.post(url, body, options).pipe(
//             catchError(this.handleError));
//     }

//     put(url: string, id: number, model: any): Observable<any> {
        
//         let body = JSON.stringify(model);
//         let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//         let options =  ({ headers: headers });
//         return this._http.put(url + id, body, options).pipe(
//             catchError(this.handleError));
//     }
//     delete(url: string, id: number): Observable<any> {
//         let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//         let options =  ({ headers: headers });
//         return this._http.delete(url + id, options).pipe(
//             catchError(this.handleError));
//     }
//     private handleError(error: HttpErrorResponse) {
//         return throwError(error || 'Server error');
//     }
// }
