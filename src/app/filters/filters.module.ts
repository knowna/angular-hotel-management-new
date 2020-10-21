import { NgModule } from '@angular/core';

import { FilterByCategory } from './filterByCategory.filter';
import { CustomerByName } from './customerByName.filter';
import { InventoryItemName } from './InventoryItemName.filter';
import { FilterMenuItemName } from './FilterMenuItemName.filter';
import { InventoryItemCategory } from './FilterItemCategory.filter';
import { FilterMenuConsumption } from './FilterMenuConsumption.filter';
import { FilterMenuCategory } from './FilterMenuCategory.filter';

@NgModule({
    declarations: [
        FilterByCategory,
        CustomerByName,
        InventoryItemName,
        FilterMenuItemName,
        InventoryItemCategory,
        FilterMenuConsumption,
        FilterMenuCategory
    ],
    exports: [
        FilterByCategory,
        CustomerByName,
        InventoryItemName,
        FilterMenuItemName,
        InventoryItemCategory,
        FilterMenuConsumption,
        FilterMenuCategory
    ]
})
export class FiltersModule{}