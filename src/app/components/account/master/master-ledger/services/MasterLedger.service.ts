import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { HttpClient } from '@angular/common/http';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Injectable()
export class MasterLedgerService {
    constructor(private _http: HttpClient) {
        this._http = _http;
    }

    get(url: string): Observable<any> {
        return this._http.get(url)
            // .map((response: Response) => <any>response.json())
            // .do(data => console.log("All: " + JSON.stringify(data)))
            // .catch(this.handleError);
    }

        // return this._http.get(url);
    //     return this._http.get(url)
    //         .map((response: Response) => <any>response.json())
    //         .do(data => console.log("All: " + JSON.stringify(data)))
    //         .catch(this.handleError);
    //  }

    post(url: string, model: any): Observable<any> {
        console.log(model,url);
        
        return this._http.post(url,model);
        // let body = JSON.stringify(model);
        // let headers = new Headers({ 'Content-Type': 'application/json' });
        // let options = new RequestOptions({ headers: headers });
        // return this._http.post(url, body, options)
        //     .map((response: Response) => <any>response.json())
        //     .catch(this.handleError);
    }

    // put(url: string, id: number, model: any): Observable<any> {
    //     let body = JSON.stringify(model);
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     return this._http.put(url + id, body, options)
    //         .map((response: Response) => <any>response.json())
    //         .catch(this.handleError);
    // }

    // delete(url: string, id: number): Observable<any> {
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     return this._http.delete(url + id, options)
    //         .map((response: Response) => <any>response.json())
    //         .catch(this.handleError);
    // }

    // private handleError(error: Response) {
    //     console.error(error);
    //     return Observable.throw(error.json().error || 'Server error');
    // }

    //getCategories() {
    //    return this._http.get("/api/CategoryAPI/Get")
    //        .map((responseData) => responseData.json());
    //}

    //GetInventoryItem(Id: string) {
    //    var params = new URLSearchParams();
    //    params.set('Id', Id);
    //    return this._http.get("/api/InventoryItemAPI/Get", { search: params })
    //        .map((responseData) => responseData.json());
    //}
}