import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/Model/order.model';
import { Product } from 'src/app/Model/product.model';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { OrderService } from 'src/app/Service/Billing/order.service';
import { MergeService } from '../services/merge.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-split-merge',
  templateUrl: './split-merge.component.html',
  styleUrls: ['./split-merge.component.css']
})
export class SplitMergeComponent implements OnInit {

  moveFromOrderItems=[];
  moveToOrderItems=[];
  primaryOrderList=[];
  secondaryOrderList=[];
  orders =[];
  showOrders=false;
  productList = [];

  modalTitle ='Split Order'
  tempPrimaryOrderList=[];

  title = "Split Order"

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

  selectedTicket: any = {};

  detailPrimaryTicket: any = {'orders':[]};

  constructor(
    private _menuItemService: BillingService,
    private mergeService: MergeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private billService: BillingService,
    private toastrService: ToastrService,
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

  showDetail(event){
    this.selectedTicket = event.value;
    this.selectedTicket.ItemList = [];
    this.selectedTicket.Orders = [];

    // this.secondaryOrderList.splice(this.secondaryOrderList.indexOf(order),1);
    // this.secondaryOrderList = [...this.secondaryOrderList];

    this.selectedTicket.showLoader = true;
    this.orderApi.loadOrdersNew(this.selectedTicket.Id)
    .subscribe(
      data => {
        this.selectedTicket.showLoader = false;
        this.orders = data;
        this.selectedTicket.orders = this.orders;
        console.log('the order s ss', this.orders)
        this.orders.forEach(o => {
            o.OrderItems.forEach(item => {
            //  item.newQty = 0;
            this.selectedTicket.ItemList.push(item)
            });
          
        });
      },
      error => {
        this.selectedTicket.showLoader = false;
        this.selectedTicket.orders = [];
      })

    this.primaryItemList = this.selectedTicket.ItemList;
    this.tempPrimaryItemList = this.primaryItemList;
  }

  ß
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

  splitOrder() {
    let isSplit = true;
    let mainItemList = [...this.tempPrimaryItemList];
    console.log('the list', mainItemList)

    let ListOrderItemPrimary=[];
    let ticketTotalWithoutVatPrimary=0;
    let vatAmountPrimary =0;
    let grandTotalPrimary =0;

    let ListOrderItemPartial=[];
    let ticketTotalWithoutVatPartial=0;
    let vatAmountPartial =0;
    let grandTotalPartial =0;


    let MainOrderItemRequestList = [];
    let SplitOrderItemRequestList = [];
    
    let fullMergeLength : any = 0;
    let allItemsZeroLength : any = 0;

    console.log('the original length', mainItemList.length)

    mainItemList.forEach(item => {
      console.log('i', item);
      const idx = mainItemList.indexOf(item);
      if(isSplit) {
        if(item.newQty < 0) {
          return isSplit = false;
        }
        else{
          if(item.newQty == 0 || item.newQty == null) {
            item.newQty = 0; 
            allItemsZeroLength += 1;

            console.log('duplicate length of zero', allItemsZeroLength , 'origin' , mainItemList.length)
            if(allItemsZeroLength == mainItemList.length) {
              isSplit =  false;
              this.toastrService.info('Sorry, you cannot merge every items of quantity 0!'); 
              return false;
            }else {
              MainOrderItemRequestList.push(item);
              isSplit =  true;
            }
            
          }
          else if(item.newQty > item.Qty) {
            isSplit =  false;
            this.toastrService.info('Max quantity allowed for ' + (this.getProductById(this.productList,item.ItemId)?.Name) +'is : ' + item.Qty);
            return false;
          }else if(item.newQty == item.Qty) {
            fullMergeLength += 1;

            console.log('duplicate length of fullMergeLength', fullMergeLength , 'origin' , mainItemList.length)
            if(fullMergeLength == mainItemList.length){
              isSplit =  false;
              this.toastrService.info('Sorry, you cannot split every items!'); 
              return false; 
            }else{
              SplitOrderItemRequestList.push(item);
              isSplit =  true;
            }
          }else if(item.newQty < item.Qty) {
            // let MainOrderItem = item;
            // let SplitOrderItem = item;

            // MainOrderItem.Qty = item.Qty - item.newQty;
            MainOrderItemRequestList.push(item);


            // SplitOrderItem.Qty = item.newQty;
            SplitOrderItemRequestList.push(item);
            isSplit = true;
          }
        }
      }
      
    });

    if(isSplit) {
      // for MainOrderItemRequest
      MainOrderItemRequestList.forEach(product => {
        let total =0;
        let unitprice = product.UnitPrice;
      
        total =total +((product.Qty - product.newQty) * product.UnitPrice);
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
      
      //for SplitOrderItemRequest
      SplitOrderItemRequestList.forEach(product => {
        let total =0;
        let unitprice = product.UnitPrice;
      
        total =total +(product.newQty*product.UnitPrice);
        ticketTotalWithoutVatPartial=ticketTotalWithoutVatPartial+ total;
      
        let id: any;
        let orderId : any;
        let orderNumber: any;


        if(product.newQty == product.Qty) {
          orderId = product.OrderId;
          orderNumber = product.OrderNumber;
          id = product.Id;
        }else{
          id = 0;
          orderId = 0;
          orderNumber = 0;
        }
      

        let OrderItem = {
            "Id":id,
            "UserId": this.currentUser.UserName,
            "FinancialYear": this.currentYear.Name,
            "OrderNumber": orderNumber,
            "OrderDescription":'',
            "OrderId":  orderId,
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

      let SplitOrderItemRequest = {
        "TicketId":0,
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

      let details = {
        "MainOrderItemRequest" : MainOrderItemRequest,
        "SplitOrderItemRequest" : SplitOrderItemRequest
      }
      
      console.log('primary is', MainOrderItemRequest);
      console.log('partial is', SplitOrderItemRequest);
      console.log('the details is', details);
      this.mergeService.splitOrder(details)
        .subscribe(
          data => {
            console.log('the data is', data)
            this.toastrService.success('Order splited successfully!');
            window.location.reload();
          },
          error => {
            console.error('the error is', error);
          }
        )
    }
    else{
      this.toastrService.info('Split is not possible!');
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
