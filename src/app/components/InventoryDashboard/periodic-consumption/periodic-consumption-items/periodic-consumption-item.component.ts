import { Component, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PeriodicConsumptionItem } from '../../../../Model/periodic-consumption-items/periodic-consumption-item';
import { DBOperation } from '../../../../Shared/enum';
import { InventoryItem } from '../../../../Model/Inventory/inventoryItem';
import { Observable } from 'rxjs/Rx';
import { InventoryReceiptDetails } from '../../../../Model/Inventory/InventoryReceipt';
import { Global } from '../../../../Shared/global';
import { IWareHouse } from '../../../../Model/WareHouse/WareHouse';
import { PeriodicConsumptionItemService } from 'src/app/Service/Inventory/peroidic-consumption-item.service';
import { InventoryReceiptService } from 'src/app/Service/Inventory/InventoryReceipt.service';

@Component({
    selector: 'my-periodicconsumptiondetails-list',
    templateUrl: './periodic-consumption-item.component.html'
})

export class PeriodicConsumptionItemComponent  {
    @Input('group')
    public pcDetails: FormGroup;
    inventoryreceipt: InventoryReceiptDetails[];
    inventoryreceipts: InventoryReceiptDetails;
    perodicconsume: PeriodicConsumptionItem;
    inventorycost: InventoryReceiptDetails;
    inventoryconsumption: PeriodicConsumptionItem;
    public inventoryItem: Observable<InventoryItem>;
    public warehouses: Observable<IWareHouse>
    public formSubmitAttempt: boolean;
    InStockValue: any;
    invnCost: any;

    constructor(
        private fb: FormBuilder,
        private _pcitemService: PeriodicConsumptionItemService,
        private _inventoryReceiptService: InventoryReceiptService,
        ) {
        this._inventoryReceiptService.getInventoryItems().subscribe(data => {
            this.inventoryItem = data
        });
        this._pcitemService.getInventoryReceipts().subscribe(data => {
            this.inventoryreceipt = data
        });
        this._pcitemService.getWareHouse().subscribe(x => {
            this.warehouses = x;
        })
    }
    
    postToApi(pcDetails: any) {
            debugger;
            var itemId = this.pcDetails.controls['InventoryItemId'].value;
            var sum = this._pcitemService.get(Global.BASE_PERIODICCONSUMPTIONITEM_ENDPOINT + itemId).subscribe((data) => {
                this.inventoryreceipts = data;
                return pcDetails.InStock.setValue(this.inventoryreceipts);
            });

            var cost = this._pcitemService.getCost(Global.BASE_COSTDETAILS_ENDPOINT + itemId).subscribe((data) => {
                this.inventorycost = data;
            });
    }

    //calculate net consumption
    calculateNetConsumption(pcDetails: any, InStockValue: any, invnCost: any) {
        var itemId = this.pcDetails.controls['InventoryItemId'].value;
        var netConsumption = this._pcitemService.getConsum(Global.BASE_PERIODICCONSUMPTIONITEM_ENDPOINT + itemId).subscribe(data => {
            debugger;
            this.inventoryreceipts = data;
            return pcDetails.InStock.setValue(this.inventoryreceipts);
        });
        debugger;
        InStockValue = this.inventoryreceipts;
        invnCost = this.inventorycost;
        return (pcDetails.PhysicalInventory.setValue(InStockValue - pcDetails.Consumption.value)),
            (pcDetails.Cost.setValue(invnCost * pcDetails.Consumption.value));
    }

    //Calculates InStock values
    calculateInStock(pcDetails: any, invnQuantitySum: any,) {
        debugger;
        if (pcDetails.InventoryItemId == 0) {
            invnQuantitySum = this.inventoryreceipts;
            return pcDetails.InStock.setValue(invnQuantitySum);
        }
        else {
            debugger;
            var itemId = this.pcDetails.controls['InventoryItemId'].value;
            var netConsumption = this._pcitemService.getConsum(Global.BASE_PERIODICCONSUMPTIONITEM_ENDPOINT + itemId).subscribe((data) => {
                this.inventoryreceipts = data;
                return pcDetails.InStock.setValue(this.inventoryreceipts);
            });
        }
    }

    //Calculates PhysicalInventory
    getPhysicalInventory(pcDetails: any, InStockValue: any) {
        InStockValue = this.inventoryreceipts;
        return pcDetails.PhysicalInventory.setValue(InStockValue - pcDetails.Consumption.value);
    }

    //Correct Calculates Cost
    getCost(pcDetails: any, invnCost: any) {
        invnCost = this.inventorycost;
        return pcDetails.Cost.setValue(invnCost * pcDetails.Consumption.value);
    }
}