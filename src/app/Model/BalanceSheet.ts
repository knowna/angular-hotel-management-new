export interface BalanceSheet {
    Id: number;
    Lability: BalanceSheetDetail[];
    Asset : BalanceSheetDetail[];
}
export class BalanceSheetDetail {
    Id: number;
    Name: string;
    Amount: number;
    NatureofGroup: string;
    AccountId: number;
    AccountTypeId: number;
    SortOrder: number;
    Bold: string;
    TabId: string;
}