export class PeriodicConsumption {
    Id: number;
    Name: string;
    StartDate: Date;
    //EndDate: Date;
    LastUpdate: Date;
    FinancialYear: string;
    UserName: string;
    CompanyCode: number;
    PeriodicConsumptionItems: PeriodicConsumptionItem[];
}

export class PeriodicConsumptionItem {
    Id: number;
    PeriodicConsumptionId: number;
    InventoryItemId: number;
    WarehouseConsumptionId: number;
    InStock: number;
    Consumption: number;
    PhysicalInventory: number;
    Cost: number;
    FinancialYear: string;
    UserName: string;
    CompanyCode: number;
}