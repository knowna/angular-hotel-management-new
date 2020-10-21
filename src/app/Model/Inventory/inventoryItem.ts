export interface IInventoryItem {
    Id: number,
    Name?: string,
    OpeningStock: number,
    OpeningStockAmount: number,
    OpeningStockRate: number,
    BaseUnit: string, //Purchase Unit
    TransactionUnit: string, //Transaction Unit
    TransactionUnitMultiplier: number,
    StockLimit: number,
    Category: ICategory[];
}

export class ICategory {
    Id: number;
    Name: string;
}

export class InventoryItem {
    Id: number;
    Name: string;
    GroupCode: string;
    BaseUnit: string;
    TransactionUnit: string;
    TransactionUnitMultiplier: number;
    Category: string;

    public constructor(Name: string) {
        this.Name = Name;
    }
}
