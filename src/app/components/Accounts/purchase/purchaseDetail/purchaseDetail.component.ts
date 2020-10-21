import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Observable } from 'rxjs/Rx';

import { InventoryItem } from '../../../../Model/Inventory/inventoryItem';
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';
@Component({
    selector: 'my-purchaseDetail-list',
    templateUrl: './purchaseDetail.component.html'
})
export class PurchaseDetailsComponent {
    @Input('group')
    public purchaseDetails: FormGroup;
    public inventoryItem: InventoryItem[];

    constructor(private _purchaseService: AccountTransactionTypeService
) {
        this._purchaseService.getInventoryItems().subscribe(data => {
            
            this.inventoryItem = data 
        });
    }

    // calculate Purchase Amount//
    calculateAmount(purchaseDetails: any) {
        
        return purchaseDetails.PurchaseAmount.setValue(purchaseDetails.Quantity.value * purchaseDetails.PurchaseRate.value);
    }
    searchChange($event) {
        console.log($event);
    }
    config = {
        displayKey: 'Name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000
    };
}