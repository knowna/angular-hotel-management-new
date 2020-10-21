// import { Component, Input } from '@angular/core';
// import { Router, Params, ActivatedRoute } from '@angular/router';
// import 'rxjs/add/operator/switchMap';
// import { Customer } from '../../../Model/customer.model';
// import {  } from '../../../Service/reservation/customer.services';

// @Component({
//    selector: 'employee-detail',
//    templateUrl: 'customerdetails.component.html',
// })

// export class CustomerDetailComponent {

//    customer: Customer;
//    pageTitle: string = 'Customer Details';
//    selectedEmployeeId: number = null;
//    constructor(
//        private router: Router,
//        private route: ActivatedRoute,
//        private _customerService: CustomerSer,
//    ) { }

//    ngOnInit(Id: number) {
//        //this.route.params
//        //    .switchMap((params: Params) =>
//        //        this._customerService.getCustomerList(params['Id']))
//        //    .subscribe((customerData: Customer) => {
//        //         ;
//        //        this.customer = customerData;
//        //        console.log(customerData);
//        //    });

//        this.route.paramMap.subscribe((params: Params) => {
            
//            let Id = parseInt(params.get('Id'));
//            this.selectedEmployeeId = Id;
//            this._customerService.getCustomerList(Id).subscribe((customerData: Customer) => {
                
//                this.customer = customerData;
//                console.log(customerData);
//            })
//        })
//    }

//    onBack() {
//        this.router.navigate(['pos-dashboard/customers']);
//    }


// }