import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';

import { ScreenOrderDetail } from '../../../../Model/AccountTransaction/accountTrans';
import { InventoryItem } from '../../../../Model/Inventory/inventoryItem';
import { Global } from '../../../../Shared/global';

@Component({
    selector: 'my-salesBillingDetail-list',
    templateUrl: './sales-billing-details.component.html'
})
export class SalesBillingDetailComponent {
    @Input('group')
    public SaleOrderDetails: FormGroup;
    public screenorderDetails: Observable<ScreenOrderDetail>;
    public inventoryItem;
    // public inventoryItem: Observable<IInventoryItem>;
    public inventoryRate: InventoryItem;

    constructor(
        private _purchaseService: AccountTransactionTypeService
,  ) {
        this._purchaseService.getInventoryItems().subscribe(
            data => {
                this.inventoryItem = data
            }
        );
    }

    // Calculate Purchase Amount
    calculateAmount(SaleOrderDetails: any) {
        return SaleOrderDetails.TotalAmount.setValue(SaleOrderDetails.Qty.value * SaleOrderDetails.UnitPrice.value);
    }

    //calculate rate 
    calcRate(SaleOrderDetails: any) {
        
        var itemId = this.SaleOrderDetails.controls['ItemId'].value;
        var sum = this._purchaseService.get(Global.BASE_INVENTORYRECEIPTDETAIL_ENDPOINT + itemId)
            .subscribe((data) => {
                this.inventoryRate = data;
                return SaleOrderDetails.UnitPrice.setValue(this.inventoryRate);
            });
    }
}
