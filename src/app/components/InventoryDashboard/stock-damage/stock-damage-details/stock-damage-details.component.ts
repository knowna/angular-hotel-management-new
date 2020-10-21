import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { IMenuItemPortion } from '../../../../Model/Menu/MenuItem';
import { MenuItemPortion } from '../../../../Model/Menu/MenuItemPortion';
import { PeriodicConsumptionItem } from '../../../../Model/periodic-consumption-items/periodic-consumption-item';
import { AccountTransactionTypeService } from '../../../../Service/Inventory/account-trans-type.service';
import { Global } from '../../../../Shared/global';

@Component({
    selector: 'stock-damage-details',
    templateUrl: './stock-damage-details.component.html'
})

export class StockDamageDetailsComponent {
    @Input('group')
    public pcDetails: FormGroup;
    imenuitemPortion: IMenuItemPortion;
    perodicconsume: PeriodicConsumptionItem;
    inventorycost: IMenuItemPortion;
    inventoryconsumption: PeriodicConsumptionItem;
    MenuItemPortions: Observable<MenuItemPortion>;
    public formSubmitAttempt: boolean;
    InStockValue: any;
    invnCost: any;

    constructor(
        private fb: FormBuilder,
        private _pcitemService: AccountTransactionTypeService,
        private _menuConsumptionService: AccountTransactionTypeService,
    ) {
        this._menuConsumptionService.getMenuConsumptionProductPortions().subscribe(data => this.MenuItemPortions = data);
    }

    //total item and total cost
    postToApi(pcDetails: any) {
         
        var itemId = this.pcDetails.controls['InventoryItemId'].value;
        var sum = this._pcitemService.get(Global.BASE_PERIODICCONSUMPTIONITEM_ENDPOINT + itemId).subscribe((data) => {
            this.imenuitemPortion = data;
            return pcDetails.InStock.setValue(this.imenuitemPortion);
        });

        var cost = this._pcitemService.getCost(Global.BASE_COSTDETAILS_ENDPOINT + itemId).subscribe((data) => {
              
            this.inventorycost = data;
        });
    }

    //calculate net consumption
    calculateNetConsumption(pcDetails: any, InStockValue: any, invnCost: any) {
        var itemId = this.pcDetails.controls['InventoryItemId'].value;
        var netConsumption = this._pcitemService.getConsum(Global.BASE_PERIODICCONSUMPTIONITEM_ENDPOINT + itemId).subscribe(data => {
             
            this.imenuitemPortion = data;
            return pcDetails.InStock.setValue(this.imenuitemPortion);
        });
         
        InStockValue = this.imenuitemPortion;
        invnCost = this.inventorycost;
        return (pcDetails.PhysicalInventory.setValue(InStockValue - pcDetails.Consumption.value)),
            (pcDetails.Cost.setValue(invnCost * pcDetails.Consumption.value));
    }

    //Calculates InStock values
    calculateInStock(pcDetails: any, invnQuantitySum: any, ) {
         
        if (pcDetails.InventoryItemId == 0) {
            invnQuantitySum = this.imenuitemPortion;
            return pcDetails.InStock.setValue(invnQuantitySum);
        }
        else
        {
             
            var itemId = this.pcDetails.controls['InventoryItemId'].value;
            var netConsumption = this._pcitemService.getConsum(Global.BASE_PERIODICCONSUMPTIONITEM_ENDPOINT + itemId).subscribe((data) => {
                this.imenuitemPortion = data;
                return pcDetails.InStock.setValue(this.imenuitemPortion);
            });
        }
    }

    //Calculates PhysicalInventory
    getPhysicalInventory(pcDetails: any, InStockValue: any) {
        InStockValue = this.imenuitemPortion;
        return pcDetails.PhysicalInventory.setValue(InStockValue - pcDetails.Consumption.value);
    }

    //Correct Calculates Cost
    getCost(pcDetails: any, invnCost: any) {
        invnCost = this.inventorycost;
        return pcDetails.Cost.setValue(invnCost * pcDetails.Consumption.value);
    }
}