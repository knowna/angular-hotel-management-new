import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { map, tap, catchError } from "rxjs/operators";
import { UnitType } from 'src/app/Model/Inventory/UnitType';
import { ICategory } from 'src/app/Model/Category';
import { MenuItemPortion } from 'src/app/Model/Menu/MenuItemPortion';
import { InventoryReceiptDetails } from 'src/app/Model/Inventory/InventoryReceipt';
import { IWareHouse, IWareHouseType } from 'src/app/Model/WareHouse/WareHouse';

import { InventoryItem } from 'src/app/Model/Inventory/inventoryItem';
import { Global } from 'src/app/Shared/global';
import { AccountType } from 'src/app/Model/AccountType/accountType';
import { NepaliMonth } from 'src/app/Model/NepaliMonth';

@Injectable()
export class AccountTransactionTypeService {
    constructor(private _http: HttpClient) {
        this._http = _http;
    }

    get(url: string): Observable<any> {
        return this._http.get(url).pipe(

            catchError(this.handleError));
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

    getAccountTypes() {
        return this._http.get(Global.BASE_ACCOUNTTYPE_ENDPOINT).pipe(
            catchError(this.handleError))
    }
    getInventoryItems(): Observable<InventoryItem[]> {

        return this._http.get<InventoryItem[]>(Global.BASE_INVENTORY_ENDPOINT).pipe(
            catchError(this.handleError))
    }

    getmasterledger() {
        return this._http.get(Global.BASE_MASTERLEDGER_ENDPOINT).pipe(
            catchError(this.handleError))
    }
    //InventoryItems
    getCategories() {
        return this._http.get(Global.BASE_CATEGORY_ENDPOINT).pipe(
            map((responseData) => responseData as ICategory[]));
        catchError(this.handleError)
    }

    getMenuUnits(url: string) {
        return this._http.get(url).pipe(
            map((responseData) => responseData as UnitType[]),
            catchError(this.handleError)
        );
    }
    deleteConsumptionDetail(url: string, id: number): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.delete(url + id, options).pipe(
            map((response: Response) => <any>response.json()),
            catchError(this.handleError));
    }



    getMenuConsumptionProductPortions() {
        return this._http.get("http://localhost:8080/api/MenuConsumptionProductPortionAPI/").pipe(
            map((responseData: Observable<MenuItemPortion>) => responseData));
    }

    getMenuConsumptionCategoryFilters() {
        return this._http.get(Global.BASE_MENUITEM_ConsumptionCategory_ENDPOINT).pipe(
            catchError(this.handleError));
    }

    getMenuConsumptionListDetails() {
        return this._http.get(Global.BASE_MENUCONSUMPTIONDETAILS_ENDPOINT).pipe(
            catchError(this.handleError));
    }




    getAccounts(): Observable<Account[]> {

        return this._http.get<Account[]>(Global.BASE_ACCOUNT_ENDPOINT).pipe(
            catchError(this.handleError)
        );

    }
    getConsum(url: string): Observable<any> {
        return this._http.get(url).pipe(

            catchError(this.handleError));
    }

    getCost(url: string): Observable<any> {
        return this._http.get(url).pipe(

            catchError(this.handleError));
    }

    getInventoryReceipts() {

        return this._http.get(Global.BASE_INVENTORYRECEIPTDETAIL_ENDPOINT).pipe(
            map((responseData: InventoryReceiptDetails[]) => responseData),
            catchError(this.handleError));
    }

    getWareHouse() {

        return this._http.get(Global.BASE_WAREHOUSEAPI_ENDPOINT).pipe(
            map((responseData: Observable<IWareHouse>) => responseData),
            catchError(this.handleError)
        );
    }
    getroomtype() {
        return this._http.get(Global.BASE_ROOMTYPE_ENDPOINT).pipe(
            catchError(this.handleError)
        )

    }

    getRoom() {
        return this._http.get(Global.BASE_ROOMAPI_ENDPOINT).pipe(
            catchError(this.handleError)
        )

    }
    getWareHouseType(): Observable<IWareHouseType> {

        return this._http.get<IWareHouseType>(Global.BASE_WAREHOUSETYPE_ENDPOINT).pipe(
            catchError(this.handleError)
        )

    }
    getaccounttypes(): Observable<AccountType[]> {

        return this._http.get<AccountType[]>("/api/AccountTypeAPI/").pipe(

            catchError(this.handleError)
        )
    }

    private extractData(res: Response) {
        let body = res.json()    // return array from json file
        return body || [];     // also return empty array if there is no data
    }
    // getAccountTypes() {

    //     return this._http.get("/api/AccountTypeAPI/get")
    //         .map((responseData) => responseData.json());
    // } 
    RemoveTransactionValues(url: string, id: number) {
         ;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = ({ headers: headers });
        return this._http.delete(url + id, options).pipe(
            catchError(this.handleError)
        )
    }

    getAccountMonths():Observable<NepaliMonth> {
        return this._http.get<NepaliMonth>(Global.BASE_NEPALIMONTH_ENDPOINT).pipe(
            catchError(this.handleError))
    }

 


    getSalesItems() {
        return this._http.get(Global.BASE_MENUCATEGORYITEM_ENDPOINT).pipe(
            catchError(this.handleError)
        )

    }
    deletePurchaseOrder() {

        return this._http.delete(`${Global.BASE_PURCHASEORDER_ENDPOINT}/RemovePurchaseDetails`).pipe(
            catchError(this.handleError)
        )

    }
    
    
    private handleError(error: HttpErrorResponse) {
        return throwError(error.message || 'Server error');
    }
    






































}