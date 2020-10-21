export class AccountTrans {
    Id: number;
    AccountTransactionDocumentId: number;
    AccountTransactionTypeId: number;
    SourceAccountTypeId: number;
    TargetAccountTypeId: number;
    IsReversed: boolean;
    Reversable: boolean;
    Amount: number;
    Discount: number;
    PercentAmount: number;
    ref_invoice_number: number;
    NetAmount: number;
    VATAmount: number;
    GrandAmount: number;
    IsDiscountPercentage: boolean;
    Name: string;
    Date: Date;
    Description: string;
    drTotal: string;
    crTotal: string;
    VType: string;
    VDate: any;
    VoucherNo: string;
    AccountTransactionValues: AccountTransactionValues[];
    InventoryReceiptDetails: InventoryReceiptDetail[];
    PurchaseOrderDetails: PurchaseOrderDetail[];
    PurchaseDetails: PurchaseDetail[];
    SalesOrderDetails: ScreenOrderDetail[];
    TicketReferences: EntityMock[];
    FinancialYear: string;
    UserName: string;
}

export class AccountTransactionValues {
    Id: number;
    AccountTypeId: number;
    AccountId: number;
    AccountGroupId: number;
    Debit: number;
    Credit: number;
    Exchange: number;
    AccountTransactionId: number;
    AccountTransactionDocumentId: number;
    entityList: EntityMock[];
    Description: string;
}

export class InventoryReceiptDetail {
    Id: number;
    Quantity: number;
    Rate: number;
    TotalAmount: number;
    InventoryItemId: number;
    InventoryReceiptId: number;
}

export class PurchaseOrderDetail {
    PurchaseOrderId: number;
    Quantity: number;
    PurchaseOrderRate: number;
    PurchaseOrdeAmount: number;
    InventoryItemId: number;
    AccountTransactionId: number;
    AccountTransactionDocumentId: number;   
}

export class PurchaseDetail {
    PurchaseId: number;
    Quantity: number;
    PurchaseRate: number;
    PurchaseAmount: number;
    InventoryItemId: number;
    AccountTransactionId: number;
    AccountTransactionDocumentId: number;
}

export class ScreenOrderDetail {
    Id: number;
    IsSelected: boolean;
    IsVoid: boolean;
    ItemId: number;
    OrderId: number;
    OrderNumber: number;
    Qty: number;
    Tags: string;
    UnitPrice: number;
    TotalAmount: number;
}

export class EntityMock {
    id: number;
    name: string
}