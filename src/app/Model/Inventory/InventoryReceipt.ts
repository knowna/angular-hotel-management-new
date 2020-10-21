export class InventoryReceipt {
    Id: number;
    AccountTypeId: number;
    Date: Date;
    ReceiptNumber: number;
    FinancialYear: string;
    UserName: string;
    CompanyCode: number;
    InventoryReceiptDetails: InventoryReceiptDetails[];
}

export class InventoryReceiptDetails{
    Id: number;
    Quantity: number;
    Rate: number;
    TotalAmount: number;
    InventoryItemId: number;
    InventoryReceiptId: number;
    BatchNo: string;
    Mdate: Date;
    Edate: Date;
    FinancialYear: string;
    UserName: string;
    CompanyCode: number;
}

