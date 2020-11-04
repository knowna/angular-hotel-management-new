import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customerByName'
})
export class CustomerByName implements PipeTransform {
  transform(customersList: any[], customerName: string): any[] {
		let filteredCustomers: any[] = [];

		if (!customerName) {
			return customersList;
		}

		filteredCustomers = customersList.filter((customer) => {
			return (customer.FirstName.toLowerCase().indexOf(customerName.toLowerCase()) !== -1);
		});

		return filteredCustomers;
  }
}