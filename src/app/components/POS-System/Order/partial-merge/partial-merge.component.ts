import { Component, OnInit } from '@angular/core';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { MergeService } from '../services/merge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/Service/Billing/order.service';

@Component({
  selector: 'app-partial-merge',
  templateUrl: './partial-merge.component.html',
  styleUrls: ['./partial-merge.component.css']
})
export class PartialMergeComponent implements OnInit {

  moveFromOrderItems=[];
  moveToOrderItems=[];
  primaryOrderList=[];
  secondaryOrderList=[];
  orders =[];
  showOrders=false;
  productList = [];

  modalTitle ='PartialMerge'
  tempPrimaryOrderList=[];

  title = "Partial Order Merge"

  config = {
    search:true,
    displayKey:"TicketId",
    searchOnKey: 'TicketId',
    height: '300px'
  }

  productConfig ={
    search:true,
    displayKey:"TicketId",
    searchOnKey: 'TicketId',
    height: '300px'
  }

  constructor(
    private _menuItemService: BillingService,
    private mergeService: MergeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private billService: BillingService,

    private orderApi: OrderService,  
  ) { }

  ngOnInit(): void {
    this.getAllUnsettledTicket();
    this.loadProducts();
  }

  loadProducts(): void {
    this.billService.loadProducts()
        .subscribe(data => { 
            this.productList=data;
    });
}

  getAllUnsettledTicket(){
    this.mergeService.getunsettleOrders()
    .subscribe(
        data =>{
          this.tempPrimaryOrderList = data;
          this.secondaryOrderList = data;
          this.primaryOrderList = this.primaryOrderList.map(function(x) {
            x.show = false;
            return x;
        })        }
    )
  }

  showDetail(order){
    order.ItemList = [];
    this.orderApi.loadOrdersNew(order.Id)
    .subscribe(
        data => {
           this.orders = data;
           this.orders.forEach(o => {
               o.OrderItems.forEach(item => {
                order.ItemList.push(item)
               });
              
           });
           
    })
  }
    getProductById(products: any[], productId: number) {
      var product = this.productList.find(product => product.Id === productId);
      
      return product;
  }

  secondaryChanged(event)
  {
    console.log(event.value);
    
  }

  moveOrder(item){
    console.log(item);
    
  }

}
