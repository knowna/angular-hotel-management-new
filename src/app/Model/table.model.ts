/**	
 * Defines the model/interface for pos-table entity
 */
export class Table {
	Id: number;
    TableId: string;
	Name?: string;
	Description?: string;
	OrderOpeningTime?: string;
	TicketOpeningTime?: string;	
	LastOrderTime?: string;
	TableStatus?: string;
	TableTypeId?: number;
	DepartmentId?: number;
	PhoteIdentity?: string;
}