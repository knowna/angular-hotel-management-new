import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InventoryReceiptService } from 'src/app/Service/Inventory/InventoryReceipt.service';
import { IInventoryItem } from '../../../../Model/Inventory/inventoryItem';

@Component({
    moduleId: module.id,
    selector: 'my-inventoryDetail-list',
    templateUrl: 'inventory-receiptdetails.component.html',
})
export class InventoryReceiptDetailsComponent  implements OnInit{
    @Input('group')
    public InventoryReceiptDetails: FormGroup;
    inventoryItem: IInventoryItem[];
    public formSubmitAttempt: boolean;

    constructor(private _inventoryReceiptService: InventoryReceiptService) {
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