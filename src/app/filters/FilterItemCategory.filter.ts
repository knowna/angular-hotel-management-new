import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'InventoryItemCategory'
})
export class InventoryItemCategory implements PipeTransform {
    transform(ItemNameList: any[], InventoryItemCategory: string): any[] {
        let filteredItemNames: any[] = [];

        if (!InventoryItemCategory) {
            return ItemNameList;
        }

        filteredItemNames = ItemNameList.filter((Category) => {
            return (Category.Name.toLowerCase().indexOf(InventoryItemCategory.toLowerCase()) !== -1);
        });

        return filteredItemNames;
    }
}