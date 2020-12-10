import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Observable } from 'rxjs/Rx';
import { PurchaseService } from 'src/app/Service/Billing/purchase.service';
import { InventoryItem } from 'src/app/Model/Inventory/inventoryItem';
@Component({
    selector: 'my-salesDetail-list',
    templateUrl: './salesDetail.component.html'
})
export class SalesDetailComponent {
    @Input('group')
    public SaleOrderDetails: FormGroup;
    public inventoryItem: Observable<InventoryItem>;
    public formSubmitAttempt: boolean;
    constructor(private _purchaseService: PurchaseService) {
        this._purchaseService.getSalesItems().subscribe(
            data => { 
                this.inventoryItem = data 
            }
        );
    }

    // Calculate Purchase Amount
    calculateAmount(SaleOrderDetails: any) {
        return SaleOrderDetails.TotalAmount.setValue(SaleOrderDetails.Qty.value * SaleOrderDetails.UnitPrice.value);
    }

    updateRate(Id: number) {
        console.log(Id);
        let rate = this.inventoryItem.filter((item) => {
            return item.Id === Id;
        })[0];
    
        if (rate) {
            this.SaleOrderDetails.controls['UnitPrice'].setValue(rate);
        }
    }
}
