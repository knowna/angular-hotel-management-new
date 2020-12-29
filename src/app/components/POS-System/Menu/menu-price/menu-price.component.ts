import { Component, OnInit } from '@angular/core';
import { IMenuCategory } from 'src/app/Model/Menu/MenuCategory';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { Global } from 'src/app/Shared/global';

@Component({
  selector: 'app-menu-price',
  templateUrl: './menu-price.component.html',
  styleUrls: ['./menu-price.component.css']
})
export class MenuPriceComponent implements OnInit {

  productList=[];
  tempProductList=[];

  menucategories: IMenuCategory[];
  
  selectedCategory = '';

  indLoading: boolean = false;

  constructor(
    private billService: BillingService,
    ) {
  }

  ngOnInit(): void {
    this.LoadMenuCategory();
    this.loadProducts();
  }

  LoadMenuCategory(): void {
    this.billService.get(Global.BASE_MENUCATEGORY_ENDPOINT)
      .subscribe(
        menucategories => { 
          this.menucategories = menucategories; 
        },
      error => {}
      );
  } 


  loadProducts(): void {
    this.indLoading = true;
    this.billService.loadProducts()
      .subscribe(
        data => { 
          this.productList = data;
          this.tempProductList = data;
          // console.log(this.productList);
          this.indLoading = false;
        },
        error => {
          this.productList = [];
          this.indLoading = false;
        }
      );
  }

  filterItems(Id: string) {
    if(Id == "") {
      this.tempProductList = this.productList;
    }else{
      this.tempProductList = this.productList.filter(x => x.CategoryId == Id);
    }
    // console.log('the id is', Id);
  }


}
