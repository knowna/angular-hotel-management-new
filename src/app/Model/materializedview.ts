export interface MaterializedView {
    Amount: number;
    Bill_Date: Date;
    Bill_no: number;
    Customer_name: string;
    Customer_Pan: number;
    Discount: number;
    Entered_By: string;
    Fiscal_Year: string;
    Is_bill_Active: boolean;
    IS_Bill_Printed: boolean;
    Is_realtime: boolean;
    Printed_by: string;
    Printed_Time: Date;
    Sync_with_IRD: string; 
    Taxable_Amount: number;
    Tax_Amount: number;
    Total_Amount: number; 
}