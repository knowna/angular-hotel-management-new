import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {BillingService} from "../../../../Service/Billing/billing.service";
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { MergeService } from '../services/merge.service';
import { OrderService } from 'src/app/Service/Billing/order.service';
import { Order } from 'src/app/Model/order.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'full-merge',
    templateUrl: 'full-merge.component.html'
})

export class FullMergeComponent implements OnInit {
    currentUser: any;
    currentYear: any;

    productList = [];

    orders:Order[]=[];
    showOrders=false;
    ticketIdTobeDeleted=0;

   moveFromOrderItems=[];
   moveToOrderItems=[];
    primaryOrderList=[];
    secondaryOrderList=[];
    tempPrimaryOrderList=[];
    tempSecondaryOrderList=[];
    primaryTicket:any;
    modalTitle="Full Order Merge"
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
            console.log(this.primaryOrderList);
            
                
            }
        )
    }
   
    secondaryChanged(event){
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
        
    }

    primaryChanged(event){
        let primarySelectedTicket;
        this.primaryTicket = event.value;

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
                    
                    this.moveFromOrderItems.forEach(order => {
                        this.moveToOrderItems.push(order);
                    });
                });
                console.log(this.primaryTicket);

                // this.calculateTotalCost(this.moveToOrderItems);
                
            }
        )
    }

    merge(){
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
            }
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
               
               console.log('the ', order)
        })
    }
  
}