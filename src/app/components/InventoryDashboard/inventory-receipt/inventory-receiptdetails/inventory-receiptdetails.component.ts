import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AccountTransactionTypeService } from '../../../../Service/Inventory/account-trans-type.service';
import { IInventoryItem } from '../../../../Model/Inventory/inventoryItem';

@Component({
    moduleId: module.id,
    selector: 'my-inventoryDetail-list',
    templateUrl: 'inventory-receiptdetails.component.html',
})
export class InventoryReceiptDetailsComponent  implements OnInit{
    @Input('group')
    public InventoryReceiptDetails: FormGroup;
    // inventoryItem: IInventoryItem[];
    inventoryItem;
    public formSubmitAttempt: boolean;

    constructor(private _inventoryReceiptService: AccountTransactionTypeService) {
        this._inventoryReceiptService.getInventoryItems().subscribe(data => { this.inventoryItem = data });
    }

    // calculate amount
    calculateAmount(InventoryReceiptDetails: any) {
        return InventoryReceiptDetails.TotalAmount.setValue(InventoryReceiptDetails.Quantity.value * InventoryReceiptDetails.Rate.value);
    }

    ngOnInit() {
        this.InventoryReceiptDetails.patchValue({
        });
    }
}