import { Pipe, PipeTransform } from '@angular/core';
import { navcomponents } from 'src/app/Shared/navcomponents';

@Pipe({
  name: 'LinksFilter'
})



export class LinksFilterPipe implements PipeTransform {


  permissionList=[
    'POS',
    'Billing',
    'Billing:Order',
    'Billing:Customer',
    'Billing:Billing',
    'Billing:Notification',
    'Billing:Menu',
    'Billing:Menu:Price',
    'Billing:Menu:Item',
    'Billing:Menu:Category',
    'Billing:Menu:Consumption',
    'Billing:Menu:Menu',
    'Billing:Menu:Table and Room Design',
    'Manage',
    'Manage:user',
    'Manage:user:login',
    'Manage:user:users',
    'Manage:user:roles',
    'Manage:user:role module',
    'Manage:user:user roles',
    'Manage:management',
    'Manage:management:department',
    'Manage:management:table-room-type',
    'Manage:management : financial year',
    'Manage:management: company',
    'Account / Finance',
    'Account:Master',
    'Account:Master:legder',
    'Account:Master:group',
    'Account:Master:legder:transactionType',
    'Account:Transaction',
    'Account:Transaction:Journal',
    'Account:Transaction:Purchase',
    'Account:Transaction:Sales',
    'Account:Transaction:Receipt',
    'Account:Transaction:Payment',
    'Account:Transaction:Bank',
    'Account:Transaction:Credit',
    'Account:Transaction:Debit',
    'Account:Report',
    'Account:Report:Day',
    'Account:Report:Ledger',
    'Account:Report:TrialBalance',
    'Account:Report:CashFlow',
    'Account:Report:FundFlow',
    'Account:Report:ProfitLoss',
    'Account:Report:BalanceSheet',
    'Account:Report:SaleBook',
    'Account:Report:SaleItemWise',
    'Account:Report:SaleDateWise',
    'Account:Report:SaleCustomerWise',
    'Account:Report:PurchaseBook',
    'Account:Report:MaterializedView',
    'Account:Report:BillReturnView',

    'Inventory',
    'Inventory:Transaction',
    'Inventory:Report',
    'Inventory:Master',
    'Inventory:Warehouse',
    'Inventory:Transaction:Receipt',
    'Inventory:Transaction:Consumption',
    'Inventory:Transaction:Stock',
    'Inventory:Report:Stock',
    'Inventory:Master:Item',
    'Inventory:Master:Category',
    'Inventory:Master:Unit',
    'Inventory:Warehouse:Warehouse',
    'Inventory:Warehouse:WareHouseType',
    // 'Front Office',
    // 'Front Office:Booking',
    // 'Front Office:Booking:Booking',
    // 'Front Office:Booking:Check-in',
    // 'Front Office:Booking:Room Status',
    // 'Front Office:Booking:Check-Out',
    // 'Front Office:Booking:Inquiry',
    // 'Front Office:Booking:Customer',
    // 'Front Office:master:Payment',
    // 'Front Office:master:facility',
    // 'Front Office:master:roomtype',
    // 'Front Office:master:customertypes',
    // 'Front Office:master:reservationtype',
    // 'Front Office:master:room',
    // 'Front Office:master'

    

];


  transform(items): any {

  if(!items) return [];
   
    
    const filteredLinks = items.filter(item => {
      
      if(this.permissionList.includes(item.permission)) {
        return item.permission;
      }
    });
    
    return filteredLinks;
  }
  
}
