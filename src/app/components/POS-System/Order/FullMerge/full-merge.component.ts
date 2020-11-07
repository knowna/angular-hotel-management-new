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
   moveFromOrderItems=[];
   moveToOrderItems=[];
    primaryOrderList=[];
    secondaryOrderList=[];
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
        let ticketIdTobeDeleted = event.value.TicketId;

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
                console.log(this.moveToOrderItems);
                
            }
        )
    }

    merge(){
        console.log(this.moveFromOrderItems, this.moveToOrderItems);
        
    }

   

  
}