import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'InventoryItemName'
})
export class InventoryItemName implements PipeTransform {
    transform(ItemNameList: any[], ItemName: string): any[] {
        let filteredItemNames: any[] = [];

        if (!ItemName) {
            return ItemNameList;
        }

        filteredItemNames = ItemNameList.filter((IInventoryItem) => {
            return (IInventoryItem.Name.toLowerCase().indexOf(ItemName.toLowerCase()) !== -1);
        });

        return filteredItemNames;
    }
}