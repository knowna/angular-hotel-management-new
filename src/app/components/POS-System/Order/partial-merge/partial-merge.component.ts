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

    this.selectedTicket = order;
    this.tempPrimaryOrderList.forEach(tick => (tick.Id != this.selectedTicket.Id) ? (tick.show = false) : (order.show));

    this.secondaryOrderList.splice(this.secondaryOrderList.indexOf(order),1);
    this.secondaryOrderList = [...this.secondaryOrderList];

    this.detailPrimaryTicket.ItemList = [];

    this.orderApi.loadOrdersNew(order.Id)
    .subscribe(
        data => {
          this.detailPrimaryTicket.orders = data;
          this.detailPrimaryTicket.orders.forEach(o => {
            o.OrderItems.forEach(item => {      
              console.log('inside left', item)
              this.detailPrimaryTicket.ItemList.push(item);
            });
          });
    });

    console.log('main main', this.detailPrimaryTicket.ItemList);
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
    this.deatilSecondaryTicket.ItemList = [];
    this.primaryItemList = [];

    this.orderApi.loadOrdersNew(order.Id)
    .subscribe(
        data => {
          this.deatilSecondaryTicket.orders = data;
          this.deatilSecondaryTicket.orders.forEach(o => {
            o.OrderItems.forEach(item => {      
              this.deatilSecondaryTicket.ItemList.push(item)
            });
          });

          this.primaryItemList = this.deatilSecondaryTicket.ItemList;
          this.tempPrimaryItemList = this.primaryItemList;
          console.log('the se',this.tempPrimaryItemList)
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
    console.log('item is', item);
    console.log('before quantity changed', this.detailPrimaryTicket.ItemList);

    // let product = this.detailPrimaryTicket.ItemList.find(p => p.Id == item.Id);
    if(item.newQty == 0) {
      item.newQty = 1;
    }
    if(item.newQty > 0) {
      if(item.newQty > item.Qty) {
        item.newQty = 1;
        this.toastrService.info('Maximum quantity allowed is ' + item.Qty);
      }else if(item.newQty == item.Qty) {
        let length : any = 0;
        this.detailPrimaryTicket.ItemList.forEach(item => {
          if(item.newQty == item.Qty) {
            length += 1;
          }
        });
        if(length == this.detailPrimaryTicket.ItemList.length){
          item.newQty = 1;
          this.toastrService.info('Sorry, you cannot merge every items.Please perform full merge for this feature'); 
        }
      }
    }
    
    // if(item.newQty > 0) {
    //   if(this.detailPrimaryTicket.ItemList.includes(item)) {
    //     if(item.newQty > item.Qty) {
    //       item.newQty = item.Qty;
    //       this.toastrService.info('Maximum quantity allowed is ' + item.Qty);
    //     }
    //   }else{
    //     if(item.newQty <= item.Qty){
    //       this.detailPrimaryTicket.ItemList.push(item);
    //     }else{
    //       this.toastrService.info('Sorry you cannot add more than the total quantity i.e '+ item.Qty);
    //     }
    //   }
    // }
    this.detailPrimaryTicket.ItemList = [...this.detailPrimaryTicket.ItemList];

    console.log('the secondary after list are', this.detailPrimaryTicket.ItemList);
    
  }

  partialMerge() {
    let originalLengthOfList = this.detailPrimaryTicket.ItemList.length;
    
    console.log('the from list' , this.detailPrimaryTicket.ItemList);
    console.log('the to list', this.deatilSecondaryTicket.ItemList);
    let mainItemList = [...this.tempPrimaryItemList];
    
    let ListOrderItemPartial=[];
    let ticketTotalWithoutVatPartial=0;
    let vatAmountPartial =0;
    let grandTotalPartial =0;

    let ListOrderItemPrimary=[];
    let ticketTotalWithoutVatPrimary=0;
    let vatAmountPrimary =0;
    let grandTotalPrimary =0;

    // console.log('the secondary list' , this.secondaryItemList);
    console.log('the primary', mainItemList)
    this.detailPrimaryTicket.ItemList.forEach(item => {
      if(item.newQty > 0) {
        if(item.Qty == item.newQty) {
          const idx = this.detailPrimaryTicket.ItemList.indexOf(item);
          this.detailPrimaryTicket.ItemList.splice(idx,1);
          // mainItemList.splice(idx,1);
          // mainItemList = mainItemList.filter
        }else if(!item.newQty) {
          item.newQty = 1;
        }

        mainItemList.push(item);
      }
      
      // mainItemList = mainItemList.filter(i => i.Id != item.Id);
    });
    


    //for partial
    this.detailPrimaryTicket.ItemList.forEach(product => {
      let total =0;
        console.log('the seco', product)
        let unitprice = product.UnitPrice;
      
        total =total +((product.Qty - product.newQty)*product.UnitPrice);
        ticketTotalWithoutVatPartial=ticketTotalWithoutVatPartial+ total;

      
        let OrderItem = {
            "Id":0,
            "UserId": this.currentUser.UserName,
            "FinancialYear": this.currentYear.Name,
            "OrderNumber": product.OrderNumber,
            "OrderDescription":'',
            "OrderId":  product.OrderId,
            "ItemId": product.ItemId,
            "Qty": (product.Qty - product.newQty),
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

    let MainOrderItemRequest = {
      // "TicketId":this.secondaryTicket.Id,
      // "TableId":this.secondaryTicket.TableId,
      // "CustomerId":this.secondaryTicket.CustomerId,
      "TicketId":this.selectedTicket.Id,
      "TableId":this.selectedTicket.TableId,
      "CustomerId":this.selectedTicket.CustomerId,
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
    
      let newQuantity= product.newQty ? product.newQty : product.Qty;
      total =total +((newQuantity)*product.UnitPrice);
      ticketTotalWithoutVatPrimary=ticketTotalWithoutVatPrimary+ total;

      let orderId : any;
      let orderNumber: any;

      if(product.newQty) {
        if(product.newQty == product.Qty) {
          orderId = product.OrderId;
          orderNumber = product.OrderNumber;
        }else{
          orderId = 0;
          orderNumber = 0;
        }
      }else{
        orderId = product.OrderId;
        orderNumber = product.OrderNumber;
      }
    
      let OrderItem = {
          "Id":product.Id,
          "UserId": this.currentUser.UserName,
          "FinancialYear": this.currentYear.Name,
          "OrderNumber": orderNumber,
          "OrderDescription":product.OrderDescription,
          "OrderId":  orderId,
          "ItemId": product.ItemId,
          "Qty": product.newQty ?  product.newQty : product.Qty,
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



    let SplitOrderItemRequest = {
      // "TicketId":this.selectedTicket.Id,
      // "TableId":this.selectedTicket.TableId,
      // "CustomerId":this.selectedTicket.CustomerId,
      "TicketId":this.secondaryTicket.Id,
      "TableId":this.secondaryTicket.TableId,
      "CustomerId":this.secondaryTicket.CustomerId,
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
      "SplitOrderItemRequest" : SplitOrderItemRequest
    }

    console.log('primary is', MainOrderItemRequest);
    console.log('partial is', SplitOrderItemRequest);
    console.log('the details is', details);

    let length: any = 0;
    this.detailPrimaryTicket.ItemList.forEach(item => {
      if(item.newQty == item.Qty) {
        length += 1;
      }
    });

    if(originalLengthOfList != length) {
      console.log('done');
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
    }else {
      console.log('not done done');
    }
  }

  getUnSubmittedOrder(orders: Order[]) {
    if (orders) {
        return orders.filter((order) => {
            return order.OrderStatus === "New Order";
        })[0];
    }
}
}
