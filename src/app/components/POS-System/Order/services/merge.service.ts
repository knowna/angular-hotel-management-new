import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Global } from 'src/app/Shared/global';


@Injectable()
export class MergeService {
    constructor(private _http: HttpClient) { }

   

    getunsettleOrders():Observable<any>{
        return this._http.get(Global.BASE_GET_UNSETTLED_ORDERS);
    }
    
    fullMerge(TicketId,details):Observable<any>{
        return this._http.post(Global.BASE_FULL_MERGE+'?TicketId='+TicketId,details);
    }

    partialMerge(main,partial):Observable<any> {
        return this._http.post(Global.BASE_PARTIAL_MERGE, main, partial);
    }

   
}