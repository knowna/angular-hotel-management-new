import { Component } from '@angular/core';

// Import Mocks

@Component({
  selector: 'dcubeHotel-menu-list',
  templateUrl: './menu-list.component.html'
})
export class MenuListComponent {

  menuList: any[] = [];

  constructor() {
	// Constructions goes here
	this.menuList = [
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
		];
  }
}
