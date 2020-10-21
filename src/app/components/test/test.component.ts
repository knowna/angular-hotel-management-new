import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { map } from 'rxjs/operators';
import { stringify } from 'querystring';
import { FormBuilder } from '@angular/forms';
import {Global} from "../../Shared/global";
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';
import * as fromReducer from "../../reducers/auth.reducer"
import { Store } from '@ngrx/store';
import * as authAction from "../../actions/auth.action"

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
public authenticated:boolean=false;
  constructor(public store:Store<{auth:fromReducer.State}> ,public http:HttpClient,public fb:FormBuilder,public _reservationService:AccountTransactionTypeService ) { }

showData(){
  
  
  this.store.dispatch({type: authAction.ActionTypes.IS_AUTHENTICATED}) 
  this.store.subscribe(data=>console.log("Sate from store",data.auth.IsAuthenticated));
 
}
hideNav(){
  this.store.dispatch({type: authAction.ActionTypes.IS_UNAUTHENTICATED})
  this.store.subscribe(data=>console.log("State form store",data.auth.IsAuthenticated));
}
}

