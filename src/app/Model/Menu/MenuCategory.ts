export interface IMenuCategory {
    Id: number,
    Name: string
}

export interface IScreenMenuCategory {
    Id: number,
    Name: string,
    MenuId: number,
    Menu_Bool: boolean
}

export class IScreenMenuCategorys {
   categoryId: number;
   MenuId: number;
   Menu_Bool: boolean;
   
    constructor(categoryId, MenuId, Menu_Bool) {
        this.categoryId = categoryId;
        this.MenuId = MenuId;
        this.Menu_Bool = Menu_Bool;
    }
}