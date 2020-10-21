/** 
 * Mocks for the products
 */

export class MenusMock {

	// Get single products details
	getProduct () {
		return this.getProducts()[0];
	}

	// Get list of products
	getProducts () {
		return [
			{
				id: 7,
				name: "laptop",
				image_path: "path/to/image",
				category_id: 23,
				description: "This is the product description",
				quantity: 12,
				unit_price: 50

			},
			{
				id: 8,
				name: "Monitor",
				image_path: "path/to/image",
				category_id: 22,
				description: "This is the product description",
				quantity: 5,
				unit_price: 50000
			},
			{
				id: 9,
				name: "headphone",
				image_path: "path/to/image",
				category_id: 3,
				description: "This is the product description",
				quantity: 2,
				unit_price: 5000
			},
			{
				id: 10,
				name: "samosa chat",
				image_path: "path/to/image",
				category_id: 23,
				description: "This is the product description",
				quantity: 12,
				unit_price: 50
			},
			{
				id: 11,
				name: "Puri tarkari",
				image_path: "path/to/image",
				category_id: 22,
				description: "This is the product description",
				quantity: 5,
				unit_price: 50000
			},
			{
				id: 12,
				name: "Veg Chowmin",
				image_path: "path/to/image",
				category_id: 3,
				description: "This is the product description",
				quantity: 2,
				unit_price: 5000
			}
		]
	}
}