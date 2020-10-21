export interface BillReturnViewModel {
    amount_for_esf: number;
    buyer_name: string;
    buyer_pan: string; 
    credit_note_date: string; 
    credit_note_number: string; 
    datetimeclient: Date; 
    esf: number; 
    excisable_amount: number; 
    excise: number; 
    export_sales: number; 
    fiscal_year: string; 
    hst: number;
    isrealtime: boolean; 
    password: string; 
    reason_for_return: string; 
    ref_invoice_number: string; 
    seller_pan: string; 
    taxable_sales_hst: number; 
    taxable_sales_vat: number;  
    tax_exempted_sales: number;  
    total_sales: number;  
    username: string; 
    vat: number; 
}
         