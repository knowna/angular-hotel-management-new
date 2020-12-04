import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AccountTransValuesService {
    constructor(private _http: HttpClient) {
        this._http = _http;
    }


    delete(url: string, id: number): Observable<any> {
        debugger;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        // let options = new RequestOptions({ headers: headers });
        return this._http.delete(url + id)
    //         .map((response: Response) => <any>response.json())
    //         .catch(this.handleError);
     }



    // private handleError(error: Response) {
    //     console.error(error);
    //     return Observable.throw(error.json().error || 'Server error');
    // }


}