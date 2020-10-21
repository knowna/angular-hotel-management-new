import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';

import { InventoryItem } from '../../../../Model/Inventory/inventoryItem';

@Component({
    selector: 'my-purchaseOrderDetail-list',
    templateUrl: './purchaseOrderDetails.component.html'
})
export class PurchaseOrderDetailComponent {
    @Input('group')
    public pOrderDetails: FormGroup;
    public inventoryItem: InventoryItem[];
    public formSubmitAttempt: boolean;

    constructor(private _purchaseOrderService: AccountTransactionTypeService
) {
        this._purchaseOrderService.getInventoryItems().subscribe(data => { this.inventoryItem = data });
    }

    // calculate amount
    calculateAmount(pOrderDetails: any) {
        
        return pOrderDetails.PurchaseOrderAmount.setValue(pOrderDetails.Quantity.value * pOrderDetails.PurchaseOrderRate.value);
    }


}