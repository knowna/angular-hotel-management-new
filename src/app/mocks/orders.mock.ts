/** 
 * Mocks for the Orders
 */

export class OrdersMock {

	// Get single Order details
	getTableOrders (tableId: string) {
		return this.getOrders().filter((item) => {
			return item.TableId === tableId;
		});
	}

	// Get list of customers
	getOrders () {
		return [
			{
			    Id: 100,
				TableId: 'BT-1000',
			    OrderNumber: 100,
			    UserId: 20,
			    TimeOfOrder: '12:23 PM',
			    OrderStatus: 'Submitted',
			    OrderItems: [{
					ItemId: 1000,
					Qty: 10,
					ProductName: 'Item from DB1',
					Tags: ["Submitted"],
					UnitPrice: 20
				},
				{
					ItemId: 1001,
					Qty: 10,
					ProductName: 'Item from DB2',
					Tags: ["submitted"],
					UnitPrice: 10
				}]
			},
			{
			    Id: 101,
				TableId: 'BT-2000',
			    OrderNumber: 101,
			    UserId: 20,
			    TimeOfOrder: '12:23 PM',
			    OrderStatus: 'Submitted',
			    OrderItems: [{
					ItemId: 1002,
					Qty: 10,
					ProductName: 'Item from DB3',
					Tags: ["Submitted"],
					UnitPrice: 20
				},
				{
					ItemId: 1003,
					Qty: 10,
					ProductName: 'Item from DB4',
					Tags: ["Submitted"],
					UnitPrice: 10
				}]
			},
			{
			    Id: 102,
				TableId: 'BT-2000',
			    OrderNumber: 102,
			    UserId: 20,
			    TimeOfOrder: '12:23 PM',
			    OrderStatus: 'New Order',
			    OrderItems: [{
					ItemId: 1004,
					Qty: 10,
					ProductName: 'Item from DB5',
					Tags: ["New order"],
					UnitPrice: 20
				},
				{
					ItemId: 1005,
					Qty: 10,
					ProductName: 'Item from DB5',
					Tags: ["New order", "Gift"],
					UnitPrice: 10
				}]
			}
		]
	}
}