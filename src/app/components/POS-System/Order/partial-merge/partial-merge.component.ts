import { Component, OnInit } from '@angular/core';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { MergeService } from '../services/merge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/Service/Billing/order.service';
import { Order } from 'src/app/Model/order.model';
import { Product } from 'src/app/Model/product.model';

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

  modalTitle ='Partial Merge'
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

  currentUser: any;

  currentYear: any;

  secondaryTicket: any;

  products: Product[] = [];

  primaryItemList: any[] = [];
  tempPrimaryItemList: any[] = [];
  secondaryItemList: any[] = [];

  constructor(
    private _menuItemService: BillingService,
    private mergeService: MergeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private billService: BillingService,

    private orderApi: OrderService,  
  ) { 
    this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
    this.currentUser = JSON.parse(localStorage.getItem('userInformation'));
  }

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
           console.log('the order s ss', this.orders)
           this.orders.forEach(o => {
               o.OrderItems.forEach(item => {
                order.ItemList.push(item)
               });
              
           });
           
           
    })

    this.primaryItemList = order.ItemList;
    this.tempPrimaryItemList = this.primaryItemList;
  }
    getProductById(products: any[], productId: number) {
      var product = this.productList.find(product => product.Id === productId);
      
      return product;
  }

  secondaryChanged(event){
    this.secondaryTicket = event.value;
    console.log(this.secondaryTicket);
  }

  moveOrder(item){
    

    if(this.secondaryItemList.includes(item)) {
      const idx = this.secondaryItemList.indexOf(item);
      this.secondaryItemList.splice(idx,1);

    }else{
      this.secondaryItemList.push(item);
    }

    console.log('the primary list are', this.tempPrimaryItemList);
    console.log('the secondary list are',this.secondaryItemList);
    
  }

  partialMerge() {
    let mainItemList = this.tempPrimaryItemList;
    let  ListOrderItem=[];
    let ticketTotalWithoutVat=0;
    let vatAmount =0;
    let grandTotal =0;
    // let UnSubmittedOrder = this.getUnSubmittedOrder(this.ordersNew);

    this.secondaryItemList.forEach(item => {
      const idx = mainItemList.indexOf(item);
      mainItemList.splice(idx,1);
    });

    console.log('the primary', mainItemList);
    
    this.secondaryItemList.forEach(product => {
      let total =0;
      let unitprice = product.UnitPrice;
      let VatPercent = 0.13; 
    
      total =total +(product.Qty*product.UnitPrice);
      ticketTotalWithoutVat=ticketTotalWithoutVat+ total;

    
      let OrderItem = {
          "Id":0,
          "UserId": this.currentUser.UserName,
          "FinancialYear": this.currentYear.Name,
          "OrderNumber": 0,
          "OrderDescription":'',
          "OrderId":  0,
          "ItemId": product.Id,
          "Qty": product.Qty,
          "UnitPrice": unitprice,
          "TotalAmount": total,
          "Tags": "New Order",
          "IsSelected": false,
          "IsVoid": false
      };
      ListOrderItem.push(OrderItem);
    });
    
    
    vatAmount =(0.13*ticketTotalWithoutVat);
    grandTotal = vatAmount+ticketTotalWithoutVat;


    let PartialOrderItemRequest = {
       
      "TicketId":this.secondaryTicket.Id,
      "TableId":this.secondaryTicket.TableId,
      "CustomerId":this.secondaryTicket.CustomerId,
      "OrderId": 0,
      "TicketTotal":ticketTotalWithoutVat,
      "Discount":0,
      "ServiceCharge":0,
      "VatAmount": vatAmount,
      "GrandTotal":grandTotal,
      "Balance":grandTotal,
      "UserId":this.currentUser.UserName,
      "FinancialYear":this.currentYear.Name,
      "ListOrderItem":ListOrderItem
    }


    this.secondaryItemList.forEach(item => {
      mainItemList = mainItemList.filter(i => i = !i);
    });
    console.log('the main item list are', mainItemList)
  }

  getUnSubmittedOrder(orders: Order[]) {
    if (orders) {
        return orders.filter((order) => {
            return order.OrderStatus === "New Order";
        })[0];
    }
}
}
