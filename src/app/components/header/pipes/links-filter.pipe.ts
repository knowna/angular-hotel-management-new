import { Pipe, PipeTransform } from '@angular/core';
import { UsersService } from 'src/app/Service/user.service';
import { navcomponents } from 'src/app/Shared/navcomponents';

@Pipe({
  name: 'LinksFilter'
})



export class LinksFilterPipe implements PipeTransform {

  constructor(
    private useService: UsersService
  ){

  }

  permissionList=[
    'POS',
    'POS:Order',
    'POS:Order:NewOrder',
    'POS:Order:OrderTicket',
    'POS:Order:FullMerge',
    'POS:Order:PartialMerge',
    'POS:Order:SplitOrder',
    'POS:Notification',
    'POS:Customer',
    'POS:Report',
    'POS:MenuSetup',
    'POS:MenuSetup:MenuPrice',
    'POS:MenuSetup:Item',
    'POS:MenuSetup:Category',
    'POS:MenuSetup:Consumption',
    'POS:MenuSetup:MenuConfigure',
    'POS:MenuSetup:TableRoomSetup',
    'POS:Order:VoidOrder',
    'POS:Order:TableMove',

    'Account',
    'Account:Transaction',
    'Account:Transaction:Journal',
    'Account:Transaction:Purchase',
    'Account:Transaction:Sales',
    'Account:Transaction:Receipt',
    'Account:Transaction:Payment',
    'Account:Transaction:BankCash',
    'Account:Transaction:CreditNote',
    'Account:Transaction:DebitNote',
    'Account:Report',
    'Account:Report:DayBook',
    'Account:Report:Ledger',
    'Account:Report:TrialBalance',
    'Account:Report:CashFlow',
    'Account:Report:FundFlow',
    'Account:Report:ProfitLoss',
    'Account:Report:BalanceSheet',
    'Account:Report:SalesBook',
    'Account:Report:SalesItemWise',
    'Account:Report:SalesDateWise',
    'Account:Report:SalesCustomerWise',
    'Account:Report:PurchaseBook',
    'Account:Report:MaterializedView',
    'Account:Report:BillReturnView',
    'Account:Master',
    'Account:Master:Ledger',
    'Account:Master:GroupLedger',
    'Account:Master:TransactionType',

    'Inventory',
    'Inventory:Transaction',
    'Inventory:Transaction:Receipt',
    'Inventory:Transaction:Consumption',
    'Inventory:Transaction:StockDamage',
    'Inventory:Master',
    'Inventory:Master:Item',
    'Inventory:Master:Category',
    'Inventory:Master:UnitType',
    'Inventory:Report',
    'Inventory:Report:StockInHand',
    'Inventory:Warehouses',
    'Inventory:Warehouses:Warehouse',
    'Inventory:Warehouses:WareHouseType',

    'Manage',
    'Manage:User',
    'Manage:User:Users',
    'Manage:User:Roles',
    'Manage:User:RoleModule',
    'Manage:User:UserRoles',
    'Manage:Management',
    'Manage:Management:Department',
    'Manage:Management:TableRoomType',
    'Manage:Management:FinancialYear',
    'Manage:Management:Company',
    'Manage:User:ChangePassword'
    
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
//  permissionList = localStorage.getItem('permissionList');

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
