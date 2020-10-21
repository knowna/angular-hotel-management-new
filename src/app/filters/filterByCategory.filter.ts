import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByCategory'
})
export class FilterByCategory implements PipeTransform {
  transform(itemsList: any[], categoryId: number): any[] {
		let filteredItems: any[] = [];
      if (categoryId == 0) {
          filteredItems = itemsList;
      }
      if (categoryId == null) {
          filteredItems = itemsList;
      }
      if (categoryId != 0) {
          filteredItems = itemsList.filter((item, index, items) => {
              return item.CategoryId === categoryId;
          });
      }
		console.log("filtered itemsList: ", filteredItems);

		return filteredItems;
  }
}