import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FilterMenuConsumption'
})
export class FilterMenuConsumption implements PipeTransform {
    transform(ItemNameList: any[], MenuConsumption: string): any[] {

        
        let filteredItemNames: any[] = [];

        if (!MenuConsumption) {
            return ItemNameList;
        }

        filteredItemNames = ItemNameList.filter((MenuItemPortion) => {
           console.log(ItemNameList,MenuConsumption);
           
            
            return (MenuItemPortion.Name.toLowerCase().indexOf(MenuConsumption.toLowerCase()) !== -1);
        });

        return filteredItemNames;
    }
}