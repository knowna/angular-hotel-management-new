import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    //moduleId: module.id,
    selector: 'inventoryIssue',
    templateUrl: './MenuItemPortion.component.html'
})
export class InventoryIssueDetailsComponent {
    @Input('group')
    public MenuItemPortionForm: FormGroup;
    constructor() {}

    calculateAmount(data) {
        // Temporary workaround
        return 0;
    }

    
}