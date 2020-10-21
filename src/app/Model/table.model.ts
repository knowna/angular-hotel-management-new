/**	
 * Defines the model/interface for pos-table entity
 */
export interface Table {
	Id: number;
    TableId: string;
	Name?: string;
	Description?: string;
	OrderOpeningTime?: string;
	TicketOpeningTime?: string;	
	LastOrderTime?: string;
	TableStatus?: string;
}