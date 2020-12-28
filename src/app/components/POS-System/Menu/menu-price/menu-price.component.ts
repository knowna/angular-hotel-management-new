import { Component, OnInit } from '@angular/core';
import { BillingService } from 'src/app/Service/Billing/billing.service';

@Component({
  selector: 'app-menu-price',
  templateUrl: './menu-price.component.html',
  styleUrls: ['./menu-price.component.css']
})
export class MenuPriceComponent implements OnInit {

  productList=[];

  indLoading: boolean = false;

  constructor(
    private billService: BillingService) {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.indLoading = true;
    this.billService.loadProducts()
      .subscribe(
        data => { 
          this.productList = data;
          this.indLoading = false;
        },
        error => {
          this.productList = [];
          this.indLoading = false;
        }
      );
  }


}
