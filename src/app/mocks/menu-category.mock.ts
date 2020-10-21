/** 
 * Mocks for the menu categories
 */

export class MenuCategoriesMock {

	// Get single menu category
	getMenuCategory () {
		return this.getMenuCategories()[0];
	}

	// Get list of menu categories
	getMenuCategories () {
		return [
			{
				id: 10007,
				name: "Menu Category one",
				description: "Description about category one"
			},
			{
				id: 10008,
				name: "Menu Category two",
				description: "Description about category two"
			}
		]
	}
}