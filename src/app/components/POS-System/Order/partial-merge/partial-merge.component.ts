import { Component, OnInit } from '@angular/core';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { MergeService } from '../services/merge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/Service/Billing/order.service';
import { Order } from 'src/app/Model/order.model';
import { Product } from 'src/app/Model/product.model';
import { ToastrService } from 'ngx-toastr';

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
  deatilSecondaryTicket:any={'orders':[]};
  detailPrimaryTicket:any={'orders':[]};
  orders =[];
  showOrders=false;
  productList = [];

  modalTitle ='Partial Order Merge'
  tempPrimaryOrderList=[];

  title = "Partial Order Merge"


  selectedTicket: any;

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
  tempSecondaryOrderList: any[] =[];

  constructor(
    private _menuItemService: BillingService,
    private mergeService: MergeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private billService: BillingService,
    private orderApi: OrderService,
    private toastrService: ToastrService  
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
          console.log('yy', data);
          this.tempPrimaryOrderList = data;
          this.secondaryOrderList = data;
          this.tempSecondaryOrderList= data;
          this.primaryOrderList = this.primaryOrderList.map(function(x) {
            x.show = false;
            return x;
        })        }
    )
  }

  showDetail(event){
    this.detailPrimaryTicket =event.value;
    let order = event.value;
    this.secondaryItemList =[];
    this.secondaryOrderList = [...this.tempSecondaryOrderList];
    order.ItemList = [];
    order.Orders = [];
    this.selectedTicket = order;
    this.tempPrimaryOrderList.forEach(tick => (tick.Id != this.selectedTicket.Id) ? (tick.show = false) : (order.show));

    this.secondaryOrderList.splice(this.secondaryOrderList.indexOf(order),1);
    this.secondaryOrderList = [...this.secondaryOrderList];

    this.orderApi.loadOrdersNew(order.Id)
    .subscribe(
        data => {
          
           this.detailPrimaryTicket.orders = data;
          //  order.Orders = this.orders;
          //  console.log('the order s ss', this.orders)
          this.detailPrimaryTicket.orders.forEach(o => {
            o.OrderItems.forEach(item => {      
              this.detailPrimaryTicket.ItemList.push(item)
            });
          });
    })

    this.primaryItemList = this.detailPrimaryTicket.ItemList;
    this.tempPrimaryItemList = this.primaryItemList;
  }

  getProductById(products: any[], productId: number) {
    var product = this.productList.find(product => product.Id === productId);
    return product;
  }

  secondaryChanged(event){
    this.secondaryTicket = event.value;
    this.deatilSecondaryTicket =event.value;
    this.showDetailSecondary(event.value);
  }



  showDetailSecondary(order){
    
    this.deatilSecondaryTicket.orders = [];
    this.orderApi.loadOrdersNew(order.Id)
    .subscribe(
        data => {
          this.deatilSecondaryTicket.orders = data;
    })
}
  moveOrder(item){
    if(this.secondaryItemList.includes(item)) {
      const idx = this.secondaryItemList.indexOf(item);
      this.secondaryItemList.splice(idx,1);
    }else{
      this.secondaryItemList.push(item);
    }
  }

  quantityChanged(item) {
    if(item.newQty > 0) {
      if(this.secondaryItemList.includes(item)) {
        if(item.newQty > item.Qty) {
          item.newQty = item.Qty;
          this.toastrService.info('Maximum quantity allowed is ' + item.Qty);
        }
      }else{
        if(item.newQty <= item.Qty){
          this.secondaryItemList.push(item);
        }else{
          this.toastrService.info('Sorry you cannot add more than the total quantity i.e '+ item.Qty);
        }
      }
    }else{
      if(item.newQty != null) {
        const idx = this.secondaryItemList.indexOf(item);
        this.secondaryItemList.splice(idx,1);
      }
      
    }

    // console.log('the secondary list are', this.secondaryItemList);
    
  }

  partialMerge() {
    let mainItemList = [...this.tempPrimaryItemList];
    
    let ListOrderItemPartial=[];
    let ticketTotalWithoutVatPartial=0;
    let vatAmountPartial =0;
    let grandTotalPartial =0;

    let ListOrderItemPrimary=[];
    let ticketTotalWithoutVatPrimary=0;
    let vatAmountPrimary =0;
    let grandTotalPrimary =0;

    console.log('the secondary list' , this.secondaryItemList);
    console.log('the primary', mainItemList)
    this.secondaryItemList.forEach(item => {
      if(item.Qty == item.newQty) {
        const idx = mainItemList.indexOf(item);
        mainItemList.splice(idx,1);
        // mainItemList = mainItemList.filter
      }
      else{

      }
      // mainItemList = mainItemList.filter(i => i.Id != item.Id);
    });
    


    //for partial
    this.secondaryItemList.forEach(product => {
      let total =0;
      let unitprice = product.UnitPrice;
    
      total =total +(product.newQty*product.UnitPrice);
      ticketTotalWithoutVatPartial=ticketTotalWithoutVatPartial+ total;

    
      let OrderItem = {
          "Id":0,
          "UserId": this.currentUser.UserName,
          "FinancialYear": this.currentYear.Name,
          "OrderNumber": 0,
          "OrderDescription":'',
          "OrderId":  0,
          "ItemId": product.ItemId,
          "Qty": product.newQty,
          "UnitPrice": unitprice,
          "TotalAmount": total,
          "Tags": "New Order",
          "IsSelected": false,
          "IsVoid": false
      };
      ListOrderItemPartial.push(OrderItem);
    });
    
    vatAmountPartial =(0.13*ticketTotalWithoutVatPartial);
    grandTotalPartial = vatAmountPartial+ticketTotalWithoutVatPartial;

    let PartialOrderItemRequest = {
      "TicketId":this.secondaryTicket.Id,
      "TableId":this.secondaryTicket.TableId,
      "CustomerId":this.secondaryTicket.CustomerId,
      "OrderId": 0,
      "TicketTotal":ticketTotalWithoutVatPartial,
      "Discount":0,
      "ServiceCharge":0,
      "VatAmount": vatAmountPartial,
      "GrandTotal":grandTotalPartial,
      "Balance":grandTotalPartial,
      "UserId":this.currentUser.UserName,
      "FinancialYear":this.currentYear.Name,
      "ListOrderItem":ListOrderItemPartial
    }




    // for primary
    mainItemList.forEach(product => {
      let total =0;
      let unitprice = product.UnitPrice;
    
      total =total +((product.Qty - product.newQty)*product.UnitPrice);
      ticketTotalWithoutVatPrimary=ticketTotalWithoutVatPrimary+ total;

    
      let OrderItem = {
          "Id":product.Id,
          "UserId": this.currentUser.UserName,
          "FinancialYear": this.currentYear.Name,
          "OrderNumber": product.OrderNumber,
          "OrderDescription":product.OrderDescription,
          "OrderId":  product.OrderId,
          "ItemId": product.ItemId,
          "Qty": product.Qty - product.newQty,
          "UnitPrice": unitprice,
          "TotalAmount": total,
          "Tags": "New Order",
          "IsSelected": false,
          "IsVoid": false
      };
      ListOrderItemPrimary.push(OrderItem);
    });

    vatAmountPrimary =(0.13*ticketTotalWithoutVatPrimary);
    grandTotalPrimary = vatAmountPrimary+ticketTotalWithoutVatPrimary;



    let MainOrderItemRequest = {
      "TicketId":this.selectedTicket.Id,
      "TableId":this.selectedTicket.TableId,
      "CustomerId":this.selectedTicket.CustomerId,
      "OrderId": 0,
      "TicketTotal":ticketTotalWithoutVatPrimary,
      "Discount":0,
      "ServiceCharge":0,
      "VatAmount": vatAmountPrimary,
      "GrandTotal":grandTotalPrimary,
      "Balance":grandTotalPrimary,
      "UserId":this.currentUser.UserName,
      "FinancialYear":this.currentYear.Name,
      "ListOrderItem":ListOrderItemPrimary
    }

    let details = {
      "MainOrderItemRequest" : MainOrderItemRequest,
      "SplitOrderItemRequest" : PartialOrderItemRequest
    }

    console.log('primary is', MainOrderItemRequest);
    console.log('partial is', PartialOrderItemRequest);
    console.log('the details is', details);
    // this.mergeService.partialMerge(details)
    //   .subscribe(
    //     data => {
    //       this.toastrService.success('Partial merged successfully!');
    //       window.location.reload();
    //     },
    //     error => {
    //       console.error('the error is', error);
    //     }
    //   )
    
  }

  getUnSubmittedOrder(orders: Order[]) {
    if (orders) {
        return orders.filter((order) => {
            return order.OrderStatus === "New Order";
        })[0];
    }
}
}
