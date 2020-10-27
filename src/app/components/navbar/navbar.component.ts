import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthenticationService } from 'src/app/Service/authentication.service';

import * as authReducer from '../../reducers/auth.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userInformation: any;

  company: any;

  constructor(public authService:AuthenticationService,
    public store:Store<{auth:authReducer.State}>
    ) { }
  public authenticated:boolean;
  ngOnInit() {
    this.userInformation = JSON.parse(localStorage.getItem("userInformation"));
    this.company = JSON.parse(localStorage.getItem("company"));
    
    this.store.subscribe(data=>this.authenticated=data.auth.IsAuthenticated)
     
    }
 logout(){
  this.authService.logout()
 }
  }


