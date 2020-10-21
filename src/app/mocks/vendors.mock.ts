/** 
 * Mocks for the vendors
 */

export class VendorsMock {
	
	// Get single vendor details
	getVendor () {
		return this.getVendors()[0];
	}

	// Get list of vendors
	getVendors () {
		return [
			{
				id: 34,
				name: "vendor one",
				email: "test@gmail.com",
				address: "This is the address",
				contact_no: "9878767654",
				description: "this is the description"
			},
			{
				id: 35,
				name: "vendor two",
				email: "test1@gmail.com",
				address: "This is the address",
				contact_no: "9878237654",
				description: "this is the description"
			},
			{
				id: 37,
				name: "vendor three",
				email: "test2@gmail.com",
				address: "This is the address",
				contact_no: "9678235254",
				description: "this is the description"
			}
		]
	}
}