/**	
 * Defines the model for product entity
 */
export interface Product {
	Id: number;
	ItemId: string;
	CategoryId: number;
    Qty: number;
	Name: string;
	Tags: any[];
	UnitPrice: number;
	Amount: number;
}