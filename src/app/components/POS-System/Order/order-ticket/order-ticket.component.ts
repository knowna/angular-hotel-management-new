import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { IDepartment } from 'src/app/Model/Department';
import { Order } from 'src/app/Model/order.model';
import { Product } from 'src/app/Model/product.model';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { OrderService } from 'src/app/Service/Billing/order.service';
import { DepartmentService } from 'src/app/Service/Department.service';
import { Global } from 'src/app/Shared/global';
import { MergeService } from '../services/merge.service';

@Component({
  selector: 'app-order-ticket',
  templateUrl: './order-ticket.component.html',
  styleUrls: ['./order-ticket.component.css']
})
export class OrderTicketComponent implements OnInit {
  
  ticketList=[];

  indLoading: boolean = false;

  ordersNew : Order[] = [];

  public company: any = {};
  
  msg: string;

  selectedTicket: any = {};

  productList:Product[]=[];

  orderNo = '';

  departments: IDepartment[];
  tempDepartments: IDepartment[];
  showLoader: boolean = false;

  constructor(
    private mergeService: MergeService,
    private orderApi: OrderService, 
    private billService: BillingService,
    private toastrService: ToastrService,
    private _departmentService: DepartmentService,
  ) {
    this.company = JSON.parse(localStorage.getItem('company'));
   }

  ngOnInit(): void {
    this.LoadDepartment();
    this.billService.loadProducts()
      .subscribe(data => { 
        this.productList = data;
    });
    this.getAllUnsettledTicket();
  }

  LoadDepartment(): void {
    this.showLoader = true;
    this._departmentService.get(Global.BASE_DEPARTMENT_ENDPOINT)
      .subscribe(departments => { 
          this.departments = departments; 
          this.tempDepartments = departments;
          console.log('the departments are', this.departments);
          this.showLoader = false; 
          // this.selectDepartment(this.departments[0]);
      },
      error => this.msg = error);
  }

  getProductById(products: Product[], productId: number) {
    var products: Product[] = products.filter((product: Product) => product.Id === productId);
    // Return product
    return products.length ? products[0] : {};
  }



  getAllUnsettledTicket() {
    this.indLoading = true;
    this.mergeService.getunsettleOrders()
      .subscribe(
        data => {
          this.indLoading = false;
          this.ticketList = data;
          console.log('the ticket list are', this.ticketList);
        },
        error => {
          this.indLoading = false;
          this.msg = <any>error
        }
      )
  }


  printTicket(ticket) {
    this.selectedTicket = ticket;
    // console.log('the ticket is', ticket)
    this.selectedTicket.itemList = [];
    this.orderApi.loadOrdersNew(ticket.Id)
      .subscribe(
        data => {
          this.ordersNew = data;
          // console.log('the orders', this.ordersNew)
          this.orderNo = this.ordersNew[0].OrderNumber + '';
          this.ordersNew.forEach(order => {
            order.OrderItems.forEach(item => {
              this.selectedTicket.itemList.push(item);
            });
          });

          if(this.selectedTicket.itemList.length > 0) {
            setTimeout(function(){ 
              (window as any).print();
            }, 1000);
            // console.log('the item list is', this.selectedTicket.itemList)
          }else{
            this.toastrService.info('No items found in the ticket!');
          }
          
        }
      )
  }

  // Calculates VAT Amount
  calculateVat() {
    let taxableAmount = this.calculateSum();
    // let taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
    return (taxableAmount * 0.13).toFixed(2);
  }

  calculateSum(): number {
    let totalAmount = 0;

    if (this.ordersNew.length) {
        this.ordersNew.forEach((order) => {
            order.OrderItems.forEach(item => {
                totalAmount += item.TotalAmount;
            });
            // totalAmount = totalAmount +
            //     (order.OrderItems.length) ? order.OrderItems.reduce((total: number, order: OrderItem) => {
            //         return total + order.Qty * eval((order.UnitPrice / 1.13).toFixed(2));
            //     }, 0) : 0;
        });
    }

    return eval(totalAmount.toFixed(2));
  }

  getGrandTotal() {
    let taxableAmount = this.calculateSum();
    // let taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
    return (taxableAmount + taxableAmount * 0.13).toFixed(2);
  }

  CurrentUnitPrice(UnitPrice: number) {
    // let currentprice = UnitPrice / 1.13;
    // Return product
    return UnitPrice.toFixed(2);
  }

  ProductPrice(UnitPrice: number, Qty: number) {
    // let currentprice = UnitPrice / 1.13 * Qty;
    let currentprice = UnitPrice * Qty;
    // Return product
    return currentprice.toFixed(2);
}


}
