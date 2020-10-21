import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FilterMenuCategory'
})
export class FilterMenuCategory implements PipeTransform {
    transform(ItemNameList: any[], MenuCategory: string): any[] {
        let filteredItemNames: any[] = [];

        if (!MenuCategory) {
            return ItemNameList;
        }

        filteredItemNames = ItemNameList.filter((Category) => {
            return (Category.Name.toLowerCase().indexOf(MenuCategory.toLowerCase()) !== -1);
        });

        return filteredItemNames;
    }
}