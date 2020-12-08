import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Observable } from 'rxjs/Rx';
import { ScreenOrderDetail } from 'src/app/Model/AccountTransaction/accountTrans';
import { IInventoryItem, InventoryItem } from 'src/app/Model/Inventory/inventoryItem';
import { PurchaseService } from 'src/app/Service/Billing/purchase.service';
import { Global } from 'src/app/Shared/global';

@Component({
    selector: 'my-salesBillingDetail-list',
    templateUrl: './sales-billing-details.component.html'
})
export class SalesBillingDetailComponent {
    @Input('group')
    public SaleOrderDetails: FormGroup;
    public screenorderDetails: Observable<ScreenOrderDetail>;
    public inventoryItem: Observable<IInventoryItem>;
    public inventoryRate: InventoryItem;

    constructor(
        private _purchaseService: PurchaseService,  ) {
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
