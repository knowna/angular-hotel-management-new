export class MenuConsumption {
    Id: number;
    CategoryId: number;
    ProductId: number;
    ProductPortionId: number;
    MenuConsumptionDetails: MenuConsumptionDetail[];
}

export class MenuConsumptionDetail {
    Id: number;
    InventoryItemId: string;
    MenuConsumptionId: string;
    Quantity: string;
}