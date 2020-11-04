import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'MenuFilter'
})
export class MenuFilter implements PipeTransform {
    transform(MenuList: any[], Name: string): any[] {
        let filteredMenus: any[] = [];

        if (!Name) {
            return MenuList;
        }

        filteredMenus = MenuList.filter((Menu) => {
            return (Menu.Name.toLowerCase().indexOf(Name.toLowerCase()) !== -1);
        });

        return filteredMenus;
    }
}