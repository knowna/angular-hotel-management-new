export class Account{
    Id: number;
    Name: string;
    AccountTypeId: number;
    ForeignCurrencyId: number;
    TaxClassificationName: string;
    TaxType: string;
    TaxRate: string;
    GSTType: string;
    ServiceCategory: string;
    ExciseDutyType: string;
    TraderLedNatureOfPurchase: string;
    TDSDeducteeType: string;
    TDSRateName: string;
    LedgerFBTCategory: string;
    IsBillWiseOn: boolean;
    ISCostCentresOn: boolean;
    IsInterestOn: boolean;
    AllowInMobile: boolean;
    IsCondensed: boolean;
    AffectsStock: boolean;
    ForPayRoll: boolean;
    InterestOnBillWise: boolean;
    OverRideInterest: boolean;
    OverRideADVInterest: boolean;
    UseForVat: boolean;
    IgnoreTDSExempt: boolean;
    IsTCSApplicable: boolean;
    IsTDSApplicable: boolean;
    IsFBTApplicable: boolean;
    IsGSTApplicable: boolean;
    ShowInPaySlip: boolean;
    UseForGratuity: boolean;
    ForServiceTax: boolean;
    IsInputCredit: boolean;
    IsExempte: boolean;
    IsAbatementApplicable: boolean;
    TDSDeducteeIsSpecialRate: boolean;
    Audited: boolean;
    SortPosition: number;
    OpeningBalance: number;
    InventoryValue: boolean;
    MaintainBilByBill: boolean;
    Address: string;
    District: string;
    City: string;
    Street: string;
    PanNo: string;
    Telephone: string;
    Email: string;
    Currency: string;
    Amount: string;
    DRCR: string;
    entityList: EntityMock[];
    public constructor(Name: string) {
        this.Name = Name;
    }
}
export class EntityMock {
    id: number;
    name: string
}