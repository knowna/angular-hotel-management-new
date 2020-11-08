import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {BillingService} from "../../../../Service/Billing/billing.service";
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { MergeService } from '../services/merge.service';
import { OrderService } from 'src/app/Service/Billing/order.service';

@Component({
    selector: 'full-merge',
    templateUrl: 'full-merge.component.html'
})

export class FullMergeComponent implements OnInit {
    currentUser: any;
    currentYear: any;

    ticketIdTobeDeleted=0;

   moveFromOrderItems=[];
   moveToOrderItems=[];
    primaryOrderList=[];
    secondaryOrderList=[];
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

    ) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('userInformation'));

        
    }

    ngOnInit(): void {
       
      this.getAllUnsettledTicket();
    }

  
    getAllUnsettledTicket(){
        this.mergeService.getunsettleOrders()
        .subscribe(
            data =>{
            this.primaryOrderList = data;
            this.secondaryOrderList = data;
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
             console.log('jjjj');
             
             this.primaryOrderList.splice(this.primaryOrderList.indexOf(secondarySelectedTicket),1);
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
        this.primaryTicket = event.value;
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
                
            }
        )
        
    }

   

  
}