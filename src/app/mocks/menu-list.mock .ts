/** 
 * Mocks for the menu
 */

export class MenuListMock {

	// Get single Menu details
	getMenu () {
		return this.getMenuList()[0];
	}

	// Get list of menu list
	getMenuList () {
		return [
			{
				id: 10007,
				name: "Vegetarian Menu",
				description: "Description about the vegetarian menu",
			},
			{
				id: 10008,
				name: "Non Vegetarian Menu",
				description: "Description about non vegetarian menu"
			}
		]
	}
}