import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FilterMenuItemName'
})
export class FilterMenuItemName implements PipeTransform {
    transform(ItemNameList: any[], MenuItemName: string): any[] {
        let filteredItemNames: any[] = [];

        if (!MenuItemName) {
            return ItemNameList;
        }

        filteredItemNames = ItemNameList.filter((MenuItem) => {
            return (MenuItem.Name.toLowerCase().indexOf(MenuItemName.toLowerCase()) !== -1);
        });

        return filteredItemNames;
    }
}