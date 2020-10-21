export class AccountType {
    Id: number;
    Name: string;
    DefaultFilterType: number;
    WorkingRule: number;
    SortOrder: number;
    Tags: string;
    UnderGroupLedger: string;
    NatureOfGroup: string;
    GroupSubLedger: boolean;
    DebitCreditBalanceReporting: boolean;
    UsedForCalculation: boolean;
    PurchaseInvoiceAllocation: boolean;
    ISBILLWISEON: boolean;
    ISCOSTCENTRESON: boolean;
    ISADDABLE: boolean;
    ISREVENUE: boolean;
    AFFECTSGROSSPROFIT: boolean;
    ISDEEMEDPOSITIVE: boolean;
    TRACKNEGATIVEBALANCES: boolean;
    ISCONDENSED: boolean;
    AFFECTSSTOCK: boolean;
    SORTPOSITION: boolean;
}