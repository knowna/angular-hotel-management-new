import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ScreenMenuCategoryFilter'
})
export class ScreenMenuCategoryFilter implements PipeTransform {
    transform(CategoryList: any[], Name: string): any[] {
        let filteredCategory: any[] = [];

        if (!Name) {
            return CategoryList;
        }

        filteredCategory = CategoryList.filter((Category) => {
            return (Category.Name.toLowerCase().indexOf(Name.toLowerCase()) !== -1);
        });

        return filteredCategory;
    }
}