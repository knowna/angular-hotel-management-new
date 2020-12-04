
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { HttpClient } from '@angular/common/http';


@Injectable()

export class JournalVoucherService {

    constructor(private _http: HttpClient) { }


    get(url: string): Observable<any> {
        return this._http.get(url);
            // .map((response: Response) => <any>response.json())
            // .do(data => console.log("All: " + JSON.stringify(data)))
            // .catch(this.handleError);
    }



    post(url: string, model: any): Observable<any> {
        // debugger;
        let body = JSON.stringify(model);
        // let headers = new Headers({ 'Content-Type': 'application/json' });
        // let options = new RequestOptions({ headers: headers });
        return this._http.post(url, body)
    //         .map((response: Response) => <any>response.json())
    //         .catch(this.handleError);
     }

    put(url: string, id: number, model: any): Observable<any> {
        // debugger;
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        // let options = new RequestOptions({ headers: headers });
        return this._http.put(url + id, body)
            // .map((response: Response) => <any>response.json())
            // .catch(this.handleError);
    }

    RemoveTransactionValues(url: string, id: number) {
        debugger;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        // let options = new RequestOptions({ headers: headers });
        return this._http.delete(url + id)
            // .map((response: Response) => <any>response.json())
            // .catch(this.handleError);
    }


    getAccounts():any {

        return this._http.get("/api/AccountAPI/get")
            // .map((responseData) => responseData.json());
    } 

    delete(url: string, model: any): Observable<any> {
        debugger;
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        // let options = new RequestOptions({ headers: headers, body: body });
        return this._http.delete(url)
            // .map((response: Response) => <any>response.json())
            // .catch(this.handleError);
    }


    // private handleError(error: Response) {
    //     console.error(error);
    //     return Observable.throw(error.json().error || 'Server error');
    // }



}

