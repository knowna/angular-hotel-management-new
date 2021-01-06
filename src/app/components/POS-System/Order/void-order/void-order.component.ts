import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/Model/order.model';
import { Product } from 'src/app/Model/product.model';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { OrderService } from 'src/app/Service/Billing/order.service';
import { RoleService } from 'src/app/Service/role.service';
import { Global } from 'src/app/Shared/global';
import { MergeService } from '../services/merge.service';

@Component({
  selector: 'app-order-ticket',
  templateUrl: './void-order.component.html',
  styleUrls: ['./void-order.component.css']
})
export class VoidOrderComponent implements OnInit {
  currentUser: any;
    currentYear: any;
itemList=[];
    productList = [];
    deatilSecondaryTicket:any={'orders':[]};
    
    detailPrimaryTicket:any={'orders':[]};
    orders:Order[]=[];
    showOrders=false;
    ticketIdTobeDeleted=0;
    selectedOrder:any={}
   moveFromOrderItems=[];
   moveToOrderItems=[];
    primaryOrderList=[];
    secondaryOrderList=[];
    tempPrimaryOrderList=[];
    tempSecondaryOrderList=[];
    primaryTicket:any;
    modalTitle=" Void Order"
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

    constructor(private fb: FormBuilder, private _menuItemService: BillingService,
        private mergeService: MergeService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private orderApi: OrderService,  
        private _roleService: RoleService,
        private billService: BillingService,
        private toastrService: ToastrService

    ) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('userInformation'));

        
    }

    ngOnInit(): void {
        this.loadProducts();
        this.getAllUnsettledTicket();
    }


    loadProducts(): void {
        this.billService.loadProducts()
            .subscribe(data => { 
                this.productList=data;
        });
    }


    getProductById(products: any[], productId: number) {
        var product = this.productList.find(product => product.Id === productId);
        return product;
    }
  
    getAllUnsettledTicket(){
        this.mergeService.getunsettleOrders()
        .subscribe(
            data =>{
            this.primaryOrderList = data;
            this.primaryOrderList = this.primaryOrderList.map(function(x) {
                x.show = false;
                return x;
            })

            this.secondaryOrderList = data;
            this.tempPrimaryOrderList= data;
            this.tempSecondaryOrderList= data;
            
                
            }
        )
    }
   
    secondaryChanged(event){
        this.selectedOrder = event;    
        this.moveFromOrderItems = [];

        // console.log(event);

        // this.showSelectedTicketDetail(event.value.TicketId);
        this.deatilSecondaryTicket =event.value;
        
        let secondarySelectedTicket;
        this.ticketIdTobeDeleted = event.value.Id;

        secondarySelectedTicket = this.primaryOrderList.find( ticket=>
            ticket.Id==this.ticketIdTobeDeleted
        )

        if(secondarySelectedTicket){
            this.primaryOrderList = [...this.tempPrimaryOrderList];
            this.primaryOrderList.splice(this.primaryOrderList.indexOf(secondarySelectedTicket),1);
            this.primaryOrderList = [...this.primaryOrderList];
        }

        this.orderApi.loadOrdersNew(event.value.Id)
            .subscribe(
                data => {
                    data.forEach(order => {
                        this.moveFromOrderItems =order.OrderItems;
                    });
                }
            )

         this.showDetail(event.value);   
        
    }

    primaryChanged(event){
        this.moveToOrderItems = [];
        let primarySelectedTicket;
        this.primaryTicket = event.value;
        this.detailPrimaryTicket =event.value;
        

        primarySelectedTicket = this.secondaryOrderList.find( ticket=> ticket.Id ==this.primaryTicket.Id);

        if(primarySelectedTicket){
            this.secondaryOrderList = [...this.tempSecondaryOrderList];
            this.secondaryOrderList.splice(this.secondaryOrderList.indexOf(primarySelectedTicket),1);
            this.secondaryOrderList = [...this.secondaryOrderList];
        }

        this.orderApi.loadOrdersNew(event.value.Id)
        .subscribe(
            data => {
                data.forEach(order => {
                    this.moveToOrderItems =order.OrderItems;
                    console.log(this.moveFromOrderItems);
                    
                    // this.moveFromOrderItems.forEach(order => {
                    //     this.moveToOrderItems.push(order);
                    // });
                });

                // this.calculateTotalCost(this.moveToOrderItems);
                
            }
        )

        this.showDetailPrimary(event.value);   
    }

    merge(){
        debugger;
        this.moveFromOrderItems.forEach(order => {
            this.moveToOrderItems.push(order)
        });
        this.calculateTotalCost(this.moveToOrderItems);

        
    }


    

    calculateTotalCost(OrderItems){
        let total =0;
        let orderId;
        OrderItems.forEach(item => {
          total =total+ item.Qty*item.UnitPrice;
        });

        this.moveToOrderItems.forEach(order => {
         orderId = order.OrderId;
        });
        let orderRequest : any={
           
            "TicketId":this.primaryTicket.Id,
            "TableId":this.primaryTicket.TableId,
            "CustomerId":this.primaryTicket.CustomerId,
            "OrderId":orderId,
            "TicketTotal":total,
            "Discount":0,
            "ServiceCharge":0,
            "VatAmount": 0.13*total,
            "GrandTotal":total+(0.13*total),
            "Balance":total+(0.13*total),
            "UserId":this.currentUser.UserName,
            "FinancialYear":this.currentYear.Name,
            "ListOrderItem":this.moveToOrderItems
    
    
        }

    console.log(orderRequest);
    this.mergeService.fullMerge(this.ticketIdTobeDeleted,orderRequest)
        .subscribe(
            data =>{
                console.log(data);
                this.toastrService.success('Tickets merged successfully!');
                window.location.reload();
            },
            error => {
                this.toastrService.error('Error while merging tickets!');
            }
        )
        
    }

    
    showDetail(order){
        // order.ItemList = [];
        this.deatilSecondaryTicket.orders = [];
        this.orderApi.loadOrdersNew(order.Id)
        .subscribe(
            data => {
               this.orders = data;
               console.log(this.orders);
               this.deatilSecondaryTicket.orders = this.orders;
               console.log(this.deatilSecondaryTicket.orders);
               
            //    order.Orders = this.orders;
            //    console.log('the orders are', order.Orders);
            //    this.orders.forEach(o => {
            //        o.OrderItems.forEach(item => {
            //         order.ItemList.push(item)
            //        });
                  
            //    });
               
        })
    }


    showDetailPrimary(primaryOrder){
        console.log(primaryOrder);
        
        this.detailPrimaryTicket.orders = [];
        this.orderApi.loadOrdersNew(primaryOrder.Id)
        .subscribe(
            data => {
                console.log(data);
            //    this.orders = data;
            //    console.log(data);
               
               this.detailPrimaryTicket.orders = data;

               
            //    order.Orders = this.orders;
            //    console.log('the orders are', order.Orders);
            //    this.orders.forEach(o => {
            //        o.OrderItems.forEach(item => {
            //         order.ItemList.push(item)
            //        });
                  
            //    });
               
        })
    }


    void(){

        this.selectedOrder.value.orders.forEach(order => {
            order.OrderItems.forEach(item => {
              this.itemList.push(item);
            });
          });
                    
            let orderRequest={
               "TicketId":this.selectedOrder.value.TicketId?this.selectedOrder.value.TicketId:0,
               "TableId":this.selectedOrder.value.TicketId?this.selectedOrder.value.TicketId:0,
               "CustomerId":this.selectedOrder.value.CustomerId?this.selectedOrder.value.CustomerId:0,
               "OrderId":this.selectedOrder.value.Id,
               "TicketTotal":0,
               "Discount":0,
               "ServiceCharge":0,
               "VatAmount": 0,
               "GrandTotal":0,
               "Balance":0,
               "UserId":this.currentUser.UserName,
               "FinancialYear":this.currentYear.Name,
               "ListOrderItem":this.itemList
           }

           console.log('orderRequest is',JSON.stringify(orderRequest) ,);
           
           this._roleService.post(Global.BASE_ORDERS_VOID_ENDPOINT,orderRequest)
           .subscribe(data => { 
            console.log(data);
            this.toastrService.success('Order Void Successfully');
               
           },

           );
        }
    
}
