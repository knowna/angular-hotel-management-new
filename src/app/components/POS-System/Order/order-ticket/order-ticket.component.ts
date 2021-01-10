import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { IDepartment } from 'src/app/Model/Department';
import { Order } from 'src/app/Model/order.model';
import { Product } from 'src/app/Model/product.model';
import { Table } from 'src/app/Model/table.model';
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


  selectedOrder: any = {};

  productList:Product[]=[];

  orderNo = '';

  departments: IDepartment[];
  tempDepartments: IDepartment[];
  selectedDepartment: IDepartment;
  showLoader: boolean = false;

  itemList = [];
  filteredItemList = [];

  orderList = [];

  tables: Table[] = [];

  constructor(
    private mergeService: MergeService,
    private orderApi: OrderService, 
    private billService: BillingService,
    private toastrService: ToastrService,
    private _departmentService: DepartmentService,
  ) {
    this.company = JSON.parse(localStorage.getItem('company'));
    // this.billService.loadTables()
    //   .subscribe(
    //     data => {
    //         this.tables = data;
    //     }
    // );

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

  selectDepartment(department: IDepartment) {
    // this.showItemLoader = true;
    this.orderList = [];
    this.filteredItemList = [];
    this.selectedDepartment = department;
    this.filteredItemList  = this.itemList.filter(item => item.DepartmentId == this.selectedDepartment.Id);
    this.filteredItemList.forEach(item => {
      const order = this.orderList.find(o => o.orderNumber == item.OrderNumber);
      if(order) {
        order.itemList.push(item);
      }else{
        let order = {
          orderNumber : '',
          itemList : [],
          TableNo: '',
          TicketOpeningTime: ''
        };
        order.itemList = [];
        order.orderNumber = item.OrderNumber,
        order.TableNo = item.TableNo,
        order.TicketOpeningTime = item.TicketOpeningTime
        order.itemList.push(item);

        this.orderList.push(order);
      }
    });

    console.log('the selected department', this.selectedDepartment);
    console.log('the order list are', this.orderList);
    console.log('the filtered item list are', this.filteredItemList)
  }


  getProductById(products: Product[], productId: number) {
    var products: Product[] = products.filter((product: Product) => product.Id === productId);
    // Return product
    return products.length ? products[0] : {};
  }



  // getAllUnsettledTicket() {
  //   this.indLoading = true;
  //   this.mergeService.getunsettleOrders()
  //     .subscribe(
  //       data => {
  //         this.indLoading = false;
  //         this.ticketList = data;
  //         console.log('the ticket list are', this.ticketList);
  //       },
  //       error => {
  //         this.indLoading = false;
  //         this.msg = <any>error
  //       }
  //     )
  // }

  getAllUnsettledTicket(){
    this.billService.loadTables()
      .subscribe(
        data => {
            this.tables = data;
            if(this.tables) {
              this.mergeService.getunsettleOrders()
                .subscribe(
                    data =>{
                      // console.log('the order ticket is', data)
                      data.forEach(ticket => {
                        const tableData = this.tables.find(t => t.Id == ticket.TableId);
                        // console.log('the table data is', tableData)
                        this.orderApi.loadOrdersNew(ticket.Id)
                        .subscribe(
                          order => {
            
                            if(order != null) {
                              order.forEach(or => {
                                or.OrderItems.forEach(item => {
                                  let newItem = {
                                    'DepartmentId': item.DepartmentId,
                                    'FinancialYear': item.FinancialYear,
                                    'Id': item.Id,
                                    'IsSelected': item.IsSelected,
                                    'IsVoid': item.IsVoid,
                                    'ItemId': item.ItemId,
                                    'OrderDescription': item.OrderDescription,
                                    'OrderId': item.OrderId,
                                    'OrderNumber': item.OrderNumber,
                                    'Qty': item.Qty,
                                    'Tags': item.Tags,
                                    'TotalAmount': item.TotalAmount,
                                    'UnitPrice': item.UnitPrice,
                                    'UserId': item.UserId,
                                    'TableNo':tableData.Name,
                                    'TicketOpeningTime':ticket.TicketOpeningTime
                                  }
                                  this.itemList.push(newItem);
                                });
                              });
                            }
            
                          }
                        )
                      });
            
            
                      // console.log('the items are', this.itemList);
            
                    }
                )
            }
        }
    );


    
  }


  printOrder(order) {
    this.selectedOrder = order;
    // console.log('the selected order  is', this.selectedOrder)
    
    if(this.selectedOrder.itemList.length > 0) {
      setTimeout(function(){ 
        (window as any).print();
      }, 1000);
      // console.log('the item list is', this.selectedTicket.itemList)
    }else{
      this.toastrService.info('No items found in the order!');
    }
          
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
