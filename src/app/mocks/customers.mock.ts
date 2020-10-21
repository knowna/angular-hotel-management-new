/** 
 * Mocks for the customers
 */

export class CustomersMock {

	// Get single customer details
	getCustomer () {
		return this.getCustomers()[0];
	}

	// Get list of customers
	getCustomers () {
		return [
			{
				id: 10007,
				name: "Haldi Ram Chaun",
				address: "simla, chetan coloney",
				description: "Description about the customer",
				email: "handi@gmail.com"
			},
			{
				id: 10008,
				name: "shiva Prasad Mishra",
				address: "kathmandu, Gongabu",
				description: "Description about the customer",
				email: "shiva@gmail.com"
			},
			{
				id: 10009,
				name: "Rustom Pawari",
				address: "Patto coloney, panji",
				description: "Description about the customer",
				email: "rustom@gmail.com"
			}
		]
	}
}