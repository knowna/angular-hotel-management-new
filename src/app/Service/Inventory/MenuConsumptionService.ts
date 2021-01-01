import { Injectable, ComponentRef, TemplateRef, EventEmitter, RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Global } from 'src/app/Shared/global';


@Injectable()
export class MenuConsumptionService {
    constructor(private _http: HttpClient) {
        this._http = _http;
    }

    get(url: string): Observable<any> {
        return this._http.get(url);
    }

    gets(url: string): Observable<any> {
        debugger
        return this._http.get(url)
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
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

    delete(url: string, id: number): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.delete(url + id, options).pipe(
            catchError(this.handleError));
    }

    deleteConsumptionDetail(url: string, id: number): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.delete(url + id, options).pipe(
            catchError(this.handleError));
    }

    private handleError (error:HttpErrorResponse) {
        return  throwError(error.error|| 'Server error');  
    }

    getMenuConsumptionProductPortions():any {
        return this._http.get(Global.BASE_HOST_ENDPOINT +"/api/MenuConsumptionProductPortionAPI/");
    } 

    getMenuConsumptionCategoryFilters():any {
        return this._http.get(Global.BASE_HOST_ENDPOINT +"/api/MenuConsumptionCategoryFilterAPI/");
    } 

    getMenuConsumptionListDetails():any {
        return this._http.get(Global.BASE_HOST_ENDPOINT +"/api/MenuConsumptionDetailAPI/");
    } 
}

