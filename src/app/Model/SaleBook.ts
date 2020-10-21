export interface SaleBook {
    Id: number,
    VDate: string,
    BillNo: string,
    BuyerName: string,
    BuyerPAN: string,
    TotalSale: number,
    NonTaxableSale: number,
    ExportSale: number,
    Discount: number,
    TaxableAmount: number,
    Tax: number
}
export interface SaleBillingBook {
    Id: number,
    VDate: string,
    BillNo: string,
    Name: string,
    BillTotal:number,
    Discount: number,
    ServiceCharge: number,
    Tax: number,
    GrandTotal: number
}
export interface SalesBillItem {
    Id: number,
    ItemName: string,
    Quantity: number,
    UnitType: string,
    Rate: number,
    Amount: number,
}
export interface SaleBookDate {
    Id: number,
    VDate: string,
    BillNo: string,
    BuyerName: string,
    BuyerPAN: string,
    TotalSale: number,
    SalesBillItems: SalesBillItem[]
}
export interface SaleBookCustomer {
    Id: number,
    VDate: string,
    BillNo: string,
    TotalSale: number
    SalesBillItems: SalesBillItem[]
}