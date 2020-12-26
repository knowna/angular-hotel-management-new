import { Component, OnInit } from '@angular/core';
import { IDepartment } from 'src/app/Model/Department';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { OrderService } from 'src/app/Service/Billing/order.service';
import { DepartmentService } from 'src/app/Service/Department.service';
import { Global } from 'src/app/Shared/global';
import { MergeService } from '../Order/services/merge.service';

@Component({
  selector: 'app-kitchen-order-view-component',
  templateUrl: './kitchen-order-view.component.html',
  styleUrls: ['./kitchen-order-view.component.css']
})
export class KitchenOrderViewComponent implements OnInit {

  departments: IDepartment[];
  tempDepartments: IDepartment[];
  indLoading: boolean = false;
  msg: string;
  itemList = [];
  filteredItemList = [];

  productList=[];

  selectedDepartment: IDepartment;

  showLoader: boolean = false;

  showItemLoader: boolean = false;

  constructor(
    private _departmentService: DepartmentService,
    private mergeService: MergeService,
    private orderApi: OrderService, 
    private billService: BillingService, 
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.LoadDepartment();
    this.getAllUnsettledTicket();
  }

  LoadDepartment(): void {
    this.showLoader = true;
    this._departmentService.get(Global.BASE_DEPARTMENT_ENDPOINT)
      .subscribe(departments => { 
          this.departments = departments; 
          this.tempDepartments = departments;
          this.showLoader = false; 
          this.selectDepartment(this.departments[0]);
      },
      error => this.msg = error);
  }

  selectDepartment(department: IDepartment) {
    // this.showItemLoader = true;
    this.filteredItemList = [];
    this.selectedDepartment = department;
    this.filteredItemList  = this.itemList.filter(item => item.DepartmentId == this.selectedDepartment.Id);
    console.log('the selected department', this.selectedDepartment);
    console.log('the filtered item list are', this.filteredItemList)
  }

  getAllUnsettledTicket(){
    this.mergeService.getunsettleOrders()
    .subscribe(
        data =>{

          data.forEach(ticket => {
            this.orderApi.loadOrdersNew(ticket.Id)
            .subscribe(
              order => {

                if(order != null) {
                  order.forEach(or => {
                    or.OrderItems.forEach(item => {
                      this.itemList.push(item);
                    });
                  });
                }

              }
            )
          });


          console.log('the items are', this.itemList);

        }
    )
  }

  loadProducts(): void {
    this.billService.loadProducts()
      .subscribe(data => { 
          this.productList = data;
          console.log('the products are', this.productList);
      });
  }

  getProductById(products: any[], productId: number) {
    var products: any[] = products.filter((product: any) => product.Id === productId);
    // Return product
    return products.length ? products[0] : {};
  }

}
