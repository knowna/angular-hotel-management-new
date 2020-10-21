import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';

@Component({
    selector: 'my-salesDetail-list',
    templateUrl: './salesDetail.component.html'
})
export class SalesDetailComponent {
    @Input('group')
    public SaleOrderDetails: FormGroup;
    public inventoryItem:any;
    public formSubmitAttempt: boolean;
    constructor(private _purchaseService: AccountTransactionTypeService) {
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
