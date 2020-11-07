import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable()
export class MergeService {
    constructor(private _http: HttpClient) { }

   

    getunsettleOrders():Observable<any>{
        return this._http.get('http://hotel.dcubeitsolution.com/api/TicketAPI/GetAllTicket')
    }

   
}