import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './Service/authentication.service';
import { Global } from './Shared/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'DCubeHotelAngular'
ngOnInit(){
  let financialyearurl=Global.BASE_FINANCIAL_YEAR_ENDPOINT
  let companyurl=Global.BASE_COMPANY_ENDPOINT
  this.authService.get(financialyearurl).subscribe(
    result=>{
    localStorage.setItem("currentYear",JSON.stringify(result[0]))
  },
    error=>{console.log(error)}
  )

  this.authService.get(companyurl).subscribe(
    result=>{
    localStorage.setItem("company",JSON.stringify(result[0]))
  },
    error=>{console.log(error)}
  )
  if(this.authService.isAuthenticated()){
    this.authService.authenticate();

  }
  
}
  constructor(public authService:AuthenticationService) {}


}
