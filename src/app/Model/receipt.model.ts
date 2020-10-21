/**	
 * Defines the model/interface for receipt entity
 */
export interface Receipt {
	receiptNumber: string;
    customerName: string;
	receiptDate: string;
	receiptProducts: any[];
}