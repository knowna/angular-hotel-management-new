import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ScreenMenuCategoryItemFilter'
})
export class ScreenMenuCategoryItemFilter implements PipeTransform {
    transform(CategoryItemList: any[], Name: string): any[] {
        let filteredCategoryItem: any[] = [];

        if (!Name) {
            return CategoryItemList;
        }

        filteredCategoryItem = CategoryItemList.filter((Item) => {
            return (Item.Name.toLowerCase().indexOf(Name.toLowerCase()) !== -1);
        });

        return filteredCategoryItem;
    }
}