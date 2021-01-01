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

  menucategories: any[] = [];
  tempMenucategories: any[] = [];
  
  selectedCategory = '';

  indLoading: boolean = false;

  config = {
    search:true,
    displayKey:"Name",
    searchOnKey: 'Name',
    height: '300px',
    placeholder:'Select Category' 
}


  constructor(
    private billService: BillingService,
    ) {
  }

  ngOnInit(): void {
    // this.LoadMenuCategory();
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

          this.indLoading = false;

          // console.log(this.productList);
          if(this.productList) {
            this.billService.get(Global.BASE_MENUCATEGORY_ENDPOINT)
              .subscribe(
                menucategories => { 
                  this.menucategories = menucategories; 
                  this.tempMenucategories = menucategories;

                  this.menucategories.forEach(category => {
                    const idx = this.tempMenucategories.indexOf(category);
                    category.itemList = this.productList.filter(item => item.CategoryId == category.Id);
                    this.tempMenucategories[idx].itemList = category.itemList;
                  });

                  // console.log('the menu categoriesa re', this.menucategories);
                },
                error => {}
              );
          }

          
        },
        error => {
          this.productList = [];
          this.indLoading = false;
        }
      );
  }

  filterItems(Id: string) {
    if(Id == "") {
      this.tempMenucategories = this.menucategories;
    }else{
      this.tempMenucategories = this.menucategories.filter(x => x.Id == Id);
    }
    // console.log('the id is', Id);
  }


}
