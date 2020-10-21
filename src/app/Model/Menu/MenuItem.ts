export class IMenuItem {
    Id: number;
    MenuItemPortionId: number;
    Name: string;
    categoryId: number;
    Barcode: string;
    Tag: string;
    MenuItemPortions: IMenuItemPortion[];
}
export class IMenuItemPortion {
    Id: string;
    Name: string;
    MenuItemPortionId: string;
    Multiplier: string;
    Price: string;
    OpeningStock: string
}
export interface IScreenMenuItem {
    Id: number,
    Name: string,
    categoryId: number,
    MenuItem_Bool: boolean,
    MenuId: number
}

export class IScreenMenuItems {
    ItemId: number;
    categoryId: number;
    MenuId: number;
    MenuItem_Bool: boolean;
    constructor(ItemId, categoryId, MenuId, MenuItem_Bool) {
        this.ItemId = ItemId;
        this.categoryId = categoryId;
        this.MenuId = MenuId;
        this.MenuItem_Bool = MenuItem_Bool;
    }
}
export interface IMenuCategoryItem {
    Id: number,
    ItemId: number,
    categoryId: number
}



